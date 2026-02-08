export function konami(callback: () => void) {
  const code = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "KeyB",
    "KeyA",
  ];
  let pos = 0;
  let timerID: number | null = null;

  const handler = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
      return;
    }
    
    const k = event.key;
    const c = event.code;
    let isCorrect = false;
    
    if (code[pos].startsWith("Arrow")) {
      if (k === code[pos]) {
        isCorrect = true;
      }
    } else if (code[pos].startsWith("Key")) {
      if (c === code[pos]) {
        isCorrect = true;
      }
    }

    if (isCorrect) {
      if (timerID !== null) {
        clearTimeout(timerID);
      }
      pos++;
      if (pos === code.length) {
        callback();
        pos = 0;
        if (timerID !== null) {
          clearTimeout(timerID);
        }
      } else {
        timerID = setTimeout(() => {pos = 0;}, 3000);
      }
    } else {
      pos = 0;
      if (timerID !== null) {
        clearTimeout(timerID);
      }
    }
  };

  window.addEventListener("keydown", handler);

  return () => window.removeEventListener("keydown", handler);
}
