// Reasoning and rendered helper widgets are not in-world character evidence.
export function storyText(value, limit = 16000) {
  return String(value || '')
    .replace(/<(think|thinking|reasoning|analysis|details)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/```(?:html)[\s\S]*?```/gi, '')
    .trim().slice(-limit);
}
