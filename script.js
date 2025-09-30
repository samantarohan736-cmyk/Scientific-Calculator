let input = document.getElementById("input");
let buttons = document.querySelectorAll(".button_container button");
let lastAnswer = 0;
let justEvaluated = false;

// Factorial function
function factorial(n) {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}
function parseExpression(expr) {
  // Replace factorials (before anything else)
  expr = expr.replace(/(\d+)!/g, (_, num) => factorial(Number(num)));

  // Replace common math functions
  expr = expr
    .replace(/sin\(/g, "Math.sin(")
    .replace(/cos\(/g, "Math.cos(")
    .replace(/tan\(/g, "Math.tan(")
    .replace(/log\(/g, "Math.log10(")
    .replace(/ln\(/g, "Math.log(")
    .replace(/exp\(/g, "Math.exp(")
    .replace(/π/g, "Math.PI")
    .replace(/rnd/g, "Math.floor(Math.random()*100)")
    .replace(/√\(/g, "Math.sqrt(")
    .replace(/∛\(/g, "Math.cbrt(")
    .replace(/÷/g, "/");

  // Replace cot(x) => 1 / Math.tan(x)
  expr = expr.replace(/cot\(([^()]+)\)/g, "1/Math.tan($1)");

  // Replace cosec(x) => 1 / Math.sin(x)
  expr = expr.replace(/cosec\(([^()]+)\)/g, "1/Math.sin($1)");

  return expr;
}


// Button clicks
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    let val = btn.dataset.value;

    if (!val && btn.id !== "equal") return;

    if (val === "AC") {
      input.value = "";
    } else if (val === "DEL") {
      input.value = input.value.slice(0, -1);
    } else if (val === "ANS") {
      input.value += lastAnswer;
    } else if (btn.id === "equal") {
      try {
        let expr = parseExpression(input.value);
        let result = eval(expr);
        if (Number.isNaN(result) || !Number.isFinite(result)) {
          throw new Error("Invalid Expression");
        }
        lastAnswer = result;
        input.value = Number.isInteger(result) ? result : result.toFixed(4);
      } catch (e) {
        alert("Error: " + e.message);
      }
      justEvaluated = true;
    } else {
      if (justEvaluated) {
        input.value = "";
        justEvaluated = false;
      }
      input.value += val;
    }
  });
});