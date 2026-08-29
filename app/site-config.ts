export const companyName = "Schettini Floor Solutions LLC";
export const shortCompanyName = "Schettini Floor Solutions";
export const businessEmail =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ||
  "accounting@schettinifloor.com";
export const businessPhone = "+17049625681";
export const businessPhoneDisplay = "(704) 962-5681";

export const socialLinks = {
  instagram: "https://www.instagram.com/schettinifloorsolutions/",
  facebook: "https://www.facebook.com/Schettinifloorsolutions/",
  googleReviews:
    "https://www.google.com/maps/search/?api=1&query=Schettini+Floor+Solutions+LLC+Charlotte+NC",
};

export function getSiteUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.URL?.trim() ||
    "https://schettini-floor-solutions.joaoduenasm.chatgpt.site";

  try {
    return new URL(configuredUrl).origin;
  } catch {
    return "https://schettini-floor-solutions.joaoduenasm.chatgpt.site";
  }
}
