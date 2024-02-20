const systemPrompt = `You are an expert tailwind developer. A user will provide you with a
 low-fidelity wireframe of an application and you will return 
 a single html file that uses tailwind to create the website. Use creative license to make the application more fleshed out.
if you need to insert an image, use placehold.co to create a placeholder image. Respond only with the html file.`

export async function POST(request: Request) {
  let { image } = await request.json()
  image = image.replace(/^data:image\/\w+;base64,/, '')

  let json = null

  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')

  const raw = JSON.stringify({
    contents: [
      {
        parts: [
          {
            text:
              '{\n        role: "system",\n        content: You are an expert tailwind developer. A user will provide you with a\n low-fidelity wireframe of an application and you will return \n a single html file that uses tailwind to create the website. Use creative license to make the application more fleshed out.\nif you need to insert an image, use placehold.co to create a placeholder image. Respond only with the html file.,\n      },\n{\n        role: "user",\n        content: [\n          {\n            type: "image_url",\n            image_url: { url: \n\n',
          },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: image,
            },
          },
          {
            text:
              '\n, detail: "high" },\n          },\n          "Turn this into a single html file using tailwind.",\n        ],\n      },\n\n',
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.4,
      topK: 32,
      topP: 1,
      maxOutputTokens: 4096,
      stopSequences: [],
    },
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  })

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow' as RequestRedirect,
  }

  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro-vision-latest:generateContent?key=${process.env.GOOGLE_API_KEY}`,
    requestOptions,
  )
  json = await resp.json()

  return new Response(JSON.stringify(json), {
    headers: {
      'content-type': 'application/json; charset=UTF-8',
    },
  })
}
