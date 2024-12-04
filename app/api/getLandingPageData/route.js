import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        const topDesigners = await prisma.designers.findMany({
            orderBy: {
                ratings: "desc",
            },
            take: 4,
            include: {
                Users: true,
            },
        });

        const topPrinterOwners = await prisma.printer_Owners.findMany({
            orderBy: {
                ratings: "desc",
            },
            take: 4,
            include: {
                Users: true,
            },
        });

        const topModels = await prisma.models.findMany({
            orderBy: {
                likes_count: "desc",
            },
            take: 4,
        });

        return NextResponse.json({
            topDesigners,
            topPrinterOwners,
            topModels,
        });
    } catch (err) {
        console.error("Database query error", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
