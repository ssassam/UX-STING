// Demo shell: an LTR/RTL switch so every transition can be checked mirrored.
const bar = document.querySelector("[data-demo-bar]");
if (bar) {
  const dir = document.createElement("button");
  dir.type = "button";
  const label = () =>
    (dir.textContent = document.documentElement.dir === "rtl" ? "Switch to LTR" : "Switch to RTL");
  dir.addEventListener("click", () => {
    document.documentElement.dir = document.documentElement.dir === "rtl" ? "ltr" : "rtl";
    label();
  });
  label();
  bar.append(dir);
}
