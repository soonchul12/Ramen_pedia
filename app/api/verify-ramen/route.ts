import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('GEMINI_API_KEY가 .env.local에 설정되어 있지 않습니다.');
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(request: Request) {
  try {
    if (!genAI) {
      return NextResponse.json(
        { error: 'AI 검수 실패', detail: 'GEMINI_API_KEY가 설정되지 않았습니다. .env.local에 GEMINI_API_KEY를 추가하세요.' },
        { status: 500 }
      );
    }

    // 1. 프론트엔드에서 보낸 이미지 URL 받기
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: '이미지 URL이 없습니다.' }, { status: 400 });
    }

    // 2. 이미지 URL에서 데이터를 다운로드하여 Gemini가 읽을 수 있는 형태로 변환
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: `이미지를 불러올 수 없습니다 (${imageResponse.status}). Supabase Storage 버킷 'ramen_photos'가 공개(Public)인지 확인하세요.` },
        { status: 400 }
      );
    }
    const arrayBuffer = await imageResponse.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg';

    // 3. Gemini 1.5 Flash 모델 (무료 한도 있음: 15 RPM, 1M TPM, 이미지 지원)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // 4. AI에게 내릴 프롬프트(명령어) 작성
    const prompt = `
      당신은 라멘 전문가입니다. 첨부된 사진이 라멘인지 판별해주세요.
      결과는 반드시 아래의 JSON 형식으로만 출력해주세요. 마크다운 기호(\`\`\`json 등)는 쓰지 마세요.
      {
        "isRamen": true 혹은 false,
        "reason": "라멘이라고 판단한 이유, 혹은 아닌 이유 (예: 차슈와 파, 뽀얀 국물이 보입니다)",
        "brothType": "돈코츠, 쇼유, 시오, 미소, 마제소바 등 육수 종류 (라멘이 아니면 null)"
      }
    `;

    // 5. 이미지와 프롬프트를 Gemini에게 전송
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      },
    ]);

    const response = result.response;
    if (!response.candidates?.length || !response.candidates[0].content?.parts?.length) {
      const reason = response.promptFeedback?.blockReason || response.candidates?.[0]?.finishReason || '응답 없음';
      return NextResponse.json(
        { error: 'AI 검수 실패', detail: `Gemini가 응답을 생성하지 못했습니다. (${reason})` },
        { status: 500 }
      );
    }

    let responseText: string;
    try {
      responseText = response.text();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return NextResponse.json(
        { error: 'AI 검수 실패', detail: `응답 파싱 오류: ${msg}` },
        { status: 500 }
      );
    }

    // 6. AI가 준 답변을 JSON 객체로 변환 (마크다운 제거 후 파싱)
    let aiResult: { isRamen?: boolean; reason?: string; brothType?: string | null };
    try {
      const trimmed = responseText.trim().replace(/^```(?:json)?\s*|\s*```$/g, '');
      aiResult = JSON.parse(trimmed);
    } catch {
      console.error('Gemini 응답 파싱 실패:', responseText);
      return NextResponse.json({ error: 'AI 응답 형식 오류', detail: responseText.slice(0, 200) }, { status: 500 });
    }

    return NextResponse.json(aiResult);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('AI 검수 중 에러 발생:', error);

    // 429 한도 초과 시 사용자 친화 안내
    if (message.includes('429') || message.includes('quota') || message.includes('Too Many Requests')) {
      return NextResponse.json(
        {
          error: 'AI 검수 실패',
          detail: '무료 한도 초과입니다. 약 1분 후 다시 시도하거나, Google AI Studio(ai.google.dev)에서 사용량·결제를 확인하세요.',
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'AI 검수 실패', detail: message },
      { status: 500 }
    );
  }
}