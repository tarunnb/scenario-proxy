import axios from "axios"

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", true)
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT")
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  )

  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" })
  }

  const { modelId, ...scenarioPayload } = req.body

  const key = process.env.SCENARIO_API_KEY
  const secret = process.env.SCENARIO_API_SECRET
  const authHeader = "Basic " + Buffer.from(`${key}:${secret}`).toString("base64")

  try {
    const response = await axios.post(
      `https://api.scenario.com/v1/inference/${modelId}/generate-async`,
      scenarioPayload,
      {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json"
        }
      }
    )
    res.status(200).json(response.data)
  } catch (error) {
    res.status(500).json({ message: error.message, error: error.response?.data })
  }
}
