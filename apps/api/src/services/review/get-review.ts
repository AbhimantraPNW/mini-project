import prisma from "@/prisma"

export const getReviewService = async (id: number) => {
try {
    const review = await prisma.review.findFirst({
        where : {id},
        include : {user : true, event : true}
    })

    if (!review) {
        throw new Error("Review not found")
    }

    return review
} catch (error) {
    throw error
}
}