import pool from "@/app/lib/db";

export async function GET(req, { params }) {
  const { userId } = params;

  try {
    // Fetch user details and sellerType
    let userDetails = await pool.query(
      'SELECT * FROM "Users" WHERE "user_id"=$1',
      [userId]
    );

    if (userDetails.rows.length === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const sellerType = userDetails.rows[0].sellerType;
    let additionalDetails = {};
    let models = [];

    if (sellerType === "Designer") {
      // Fetch designer details
      const designerDetails = await pool.query(
        'SELECT bio, ratings FROM "Designers" WHERE user_id=$1',
        [userId]
      );
      additionalDetails = designerDetails.rows[0] || {};

      // Fetch designer models
      const designerModels = await pool.query(
        'SELECT * FROM "Models" WHERE "designer_id"=(SELECT designer_id FROM "Designers" WHERE user_id=$1)',
        [userId]
      );
      models = designerModels.rows || [];
    } else if (sellerType === "Printer_Owner") {
      // Fetch printer owner details
      const printerOwnerDetails = await pool.query(
        'SELECT bio, ratings FROM "Printer_Owners" WHERE user_id=$1',
        [userId]
      );
      additionalDetails = printerOwnerDetails.rows[0] || {};
    }

    const response = { ...userDetails.rows[0], ...additionalDetails, models };
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch User details" }),
      { status: 500 }
    );
  }
}
