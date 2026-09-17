/* Products the society offers but has not yet supplied terms for.
   published: false keeps them out of the nav and the sitemap while the page
   itself stays honest — an enquiry panel, never an invented rate. */

export const accounts = [
  {
    slug: "savings",
    title: "Savings Account",
    published: false,
    summary:
      "A member savings account for everyday deposits and withdrawals, with passbook records and SMS alerts.",
    fields: {
      interestRate: "", // CLIENT INPUT
      minimumBalance: "", // CLIENT INPUT
      openingAmount: "", // CLIENT INPUT
    },
  },
  {
    slug: "current",
    title: "Current Account",
    published: false,
    summary:
      "For businesses and traders who need frequent transactions rather than interest.",
    fields: {
      minimumBalance: "", // CLIENT INPUT
      charges: "", // CLIENT INPUT
      chequeBook: "", // CLIENT INPUT
    },
  },
];

export const loans = {
  published: false,
  intro:
    "As a credit co-operative, lending to members is central to what the society does — with fast approvals and minimal paperwork.",
  products: [], // CLIENT INPUT — product, rate, tenure, security, documents
};

export const kycDocuments = [
  "Proof of identity (Aadhaar, PAN, voter ID or passport)",
  "Proof of address",
  "Two recent passport-size photographs",
  "Introduction by an existing member, where required",
];
