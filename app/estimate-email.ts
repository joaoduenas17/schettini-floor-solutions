export function prepareEstimateEmail(data: FormData, recipient: string) {
  const value = (name: string) => String(data.get(name) || "").trim();
  const body = [
    "Hello Schettini Floor Solutions,",
    "I would like to discuss a flooring project.",
    "",
    `Name: ${value("name")}`,
    `Company: ${value("company") || "Not provided"}`,
    `Email: ${value("email")}`,
    `Phone: ${value("phone") || "Not provided"}`,
    `Service: ${value("service")}`,
    `Project location: ${value("location")}`,
    "",
    "Project details:",
    value("message") || "To be discussed.",
  ].join("\n");
  return { body, href: `mailto:${recipient}?subject=${encodeURIComponent("Flooring project estimate request")}&body=${encodeURIComponent(body)}` };
}
