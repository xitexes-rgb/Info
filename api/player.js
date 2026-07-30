export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { uid, region } = req.query;

  if (!uid || !region) {
    return res.status(400).json({
      error: true,
      message: "Missing required parameters: 'uid' and 'region'.",
    });
  }

  const normalizeRegion = (r) => {
    const norm = r.toLowerCase().trim();
    if (["me", "middle east", "mena"].includes(norm)) return "ME";
    if (["ind", "india"].includes(norm)) return "IND";
    if (["br", "brazil"].includes(norm)) return "BR";
    if (["us", "usa", "united states", "america"].includes(norm)) return "US";
    if (["bd", "bangladesh"].includes(norm)) return "BD";
    if (["pk", "pakistan"].includes(norm)) return "PK";
    if (["th", "thailand"].includes(norm)) return "TH";
    if (["vn", "vietnam"].includes(norm)) return "VN";
    if (["id", "indonesia"].includes(norm)) return "ID";
    if (["sac", "south america"].includes(norm)) return "SAC";
    return norm.toUpperCase();
  };

  const normalizedRegion = normalizeRegion(region);
  const targetUrl = `https://info-vip-api.vercel.app/info?uid=${uid}&region=${normalizedRegion}`;

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "User-Agent": "XitexeInfoAPI/1.0",
      },
    });

    const data = await response.json();

    if (!response.ok || (data.error && data.error === true)) {
      return res.status(response.status || 400).json({
        error: true,
        message: data.message || "Player not found or external API error.",
      });
    }

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error. Unable to communicate with the provider.",
    });
  }
}
