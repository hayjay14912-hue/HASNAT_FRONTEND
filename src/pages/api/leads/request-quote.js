const requiredFields = [
  "device",
  "role",
  "clinicName",
  "clinicType",
  "city",
  "timeline",
  "budgetRange",
  "firstName",
  "lastName",
  "email",
  "phone"
];

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const data = req.body || {};
  const missingField = requiredFields.find((field) => !data[field]);

  if (missingField) {
    return res.status(400).json({ message: `Missing required field: ${missingField}` });
  }

  const leadId = `RQ-${Date.now()}`;
  const leadPayload = {
    leadId,
    receivedAt: new Date().toISOString(),
    status: "new",
    source: data.sourcePage || "unknown",
    formType: data.formType || "device_quote",
    inquiry: {
      device: data.device,
      role: data.role,
      clinicName: data.clinicName,
      clinicType: data.clinicType,
      city: data.city,
      timeline: data.timeline,
      budgetRange: data.budgetRange,
      message: data.message || ""
    },
    contact: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone
    }
  };

  console.log("[request-quote-lead]", JSON.stringify(leadPayload));

  return res.status(200).json({
    success: true,
    leadId,
    message: "Quote request submitted successfully"
  });
}
