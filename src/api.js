// export async function fetchQuestions(category) {
//   const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
//   const prompt = `Génère une question de culture générale en français sur le sujet ${category} avec quatre options de réponse. Formate la réponse comme suit : 'Question : ... ? A) ... B) ... C) ... D) ...'. Fournis également la réponse correcte à la fin en la précédant de 'Réponse :'.`;

//   try {
//     const response = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${apiKey}`,
//       },
//       body: JSON.stringify({
//         model: "gpt-3.5-turbo-0125",
//         messages: [
//           {
//             role: "user",
//             content: prompt,
//           },
//         ],
//         max_tokens: 150,
//         n: 1,
//         stop: ["\n"],
//       }),
//     });

//     const data = await response.json();
//     console.log("Raw API Response:", data);

//     if (!data.choices || !data.choices[0] || !data.choices[0].message) {
//       throw new Error("La réponse de l'API est invalide.");
//     }

//     const questionText = data.choices[0].message.content.trim();
//     console.log("Formatted Question Text:", questionText);

//     // Utilisation d'une expression régulière pour capturer les options
//     const questionMatch = questionText.match(
//       /Question\s*:\s*(.*?)\s*A\)\s*(.*?)\s*B\)\s*(.*?)\s*C\)\s*(.*?)\s*D\)\s*(.*)/
//     );

//     if (!questionMatch) {
//       // Si les options ne sont pas présentes, retourne la question sans options
//       return {
//         question: questionText,
//         options: [],
//         correctAnswer: null,
//       };
//     }

//     const [, question, optionA, optionB, optionC, optionD] = questionMatch;

//     // Tentative d'extraction de la réponse correcte
//     let correctAnswer = null;
//     const correctAnswerMatch = questionText.match(/Réponse\s*:\s*(.*)/);

//     if (correctAnswerMatch) {
//       correctAnswer = correctAnswerMatch[1].trim();
//     } else {
//       // Si aucune réponse correcte n'est trouvée, essaie de l'extraire en supposant que l'API retourne la bonne réponse juste après les options
//       const possibleAnswerMatch = questionText.match(/D\)\s*(.*?)$/);
//       if (possibleAnswerMatch) {
//         correctAnswer = possibleAnswerMatch[1].trim();
//       }
//     }

//     if (!correctAnswer) {
//       throw new Error("Impossible d'extraire la réponse correcte.");
//     }

//     return {
//       question: question.trim(),
//       options: [optionA.trim(), optionB.trim(), optionC.trim(), optionD.trim()],
//       correctAnswer: correctAnswer,
//     };
//   } catch (error) {
//     console.error("Erreur lors de l'appel à l'API :", error);
//     throw error;
//   }
// }
