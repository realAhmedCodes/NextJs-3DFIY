import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../../lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    const client = await pool.connect();
    const userQuery = 'SELECT * FROM "Users" WHERE email = $1';
    const userResult = await client.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { detail: "User does not exist!" },
        { status: 401 }
      );
    }

    const user = userResult.rows[0];
    const match = await bcrypt.compare(password, user.password);
console.log(  user.user_id,
       user.email,
       user.sellerType,
      user.phoneNo,
    user.location)
    if (match) {
      console.log("match")
      let sellerId = null;
      let tokenPayload = {
        user_id: user.user_id,
        email: user.email,
        sellerType: user.sellerType,
      };

      if (user.sellerType === "Designer") {
        console.log("des");
        const designerQuery = 'SELECT * FROM "Designers" WHERE user_id = $1';
        const designerResult = await client.query(designerQuery, [
          user.user_id,
        ]);
        sellerId = designerResult.rows.length
          ? designerResult.rows[0].designer_id
          : null;
        console.log(sellerId, "cccc");
        tokenPayload = { ...tokenPayload, seller_id: sellerId };
      } else if (user.sellerType === "Printer_Owners") {
        console.log("pri");
        const printerOwnerQuery =
          "SELECT * FROM 'Printer_Owners' WHERE user_id = $1";
        const printerOwnerResult = await client.query(printerOwnerQuery, [
          user.user_id,
        ]);
        sellerId = printerOwnerResult.rows.length
          ? printerOwnerResult.rows[0].printer_owner_id
          : null;
        console.log(sellerId, "cccc");
        tokenPayload = { ...tokenPayload, seller_id: sellerId };
      }

      const token = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1hr",
      });

      return NextResponse.json({ email: user.email, token });
    } else {
      return NextResponse.json({ detail: "Login failed" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error", error);
    return NextResponse.json(
      { detail: "Internal Server Error" },
      { status: 500 }
    );
  }
}




/*import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../../lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    const client = await pool.connect();
    const userQuery = 'SELECT * FROM "Users" WHERE email = $1';
    const userResult = await client.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { detail: "User does not exist!" },
        { status: 401 }
      );
    }

    const user = userResult.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      let sellerId = null;
      let tokenPayload = {
        user_id: user.user_id,
        email: user.email,
        sellerType: user.sellertype,
      };

      if (user.sellertype === "Designer") {
        const designerQuery = 'SELECT * FROM "Designers" WHERE user_id = $1';
        const designerResult = await client.query(designerQuery, [
          user.user_id,
        ]);
        sellerId = designerResult.rows.length
          ? designerResult.rows[0].designer_id
          : null;
        tokenPayload = { ...tokenPayload, seller_id: sellerId };
      } else if (user.sellertype === "Printer Owner") {
        const printerOwnerQuery =
          'SELECT * FROM Printer_Owners WHERE user_id = $1';
        const printerOwnerResult = await client.query(printerOwnerQuery, [
          user.user_id,
        ]);
        sellerId = printerOwnerResult.rows.length
          ? printerOwnerResult.rows[0].printer_owner_id
          : null;
        tokenPayload = { ...tokenPayload, seller_id: sellerId };
      }

      const token = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1hr",
      });

      return NextResponse.json({ email: user.email, token });
    } else {
      return NextResponse.json({ detail: "Login failed" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error", error);
    return NextResponse.json(
      { detail: "Internal Server Error" },
      { status: 500 }
    );
  }
}
*/