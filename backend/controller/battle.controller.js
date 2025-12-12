import battleModel from "../model/battle.model.js"

export const fetchRoomDetails = async (request, response) => {
    try {
        const { roomId } = request.query || {}

        if (!roomId) {
            console.log("RoomId required!")
            return response.status(400).json({
                message: "RoomId required!",
                error: true,
                success: false
            })
        }

        const room = await battleModel.findOne({ roomId: roomId })

        if (!room) {
             console.log("Room not found!")
            return response.status(400).json({
                message: "Room not found!",
                error: true,
                success: false
            })
        }

        const player = []

        room.players.forEach((m)=>{
            player.push({
                userId : m.userId,
                user_nanoId : m.user_nanoId,
                userName : m.userName,
                admin : m.admin,
                submit : m.submit
            })
        })

        return response.json({
            message: "Room details",
            error: false,
            success: true,
            data: {
                roomId: roomId,
                battleId: room._id,
                topic: room.topic,
                player: player
            }
        })

    } catch (error) {
        console.log("Fetch room details error", error)
    }
}