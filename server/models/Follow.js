const { ObjectId } = require("mongodb");
const database = require("../config/mongodb");


class Follow {
    static collection(){
        return database.collection("follows");
    }
    static async getAllFollows(){
        return await this.collection().find().toArray();
    }
    static async addFollow(newFollow, followerId){
        newFollow.followingId = new ObjectId(String(newFollow.followingId))
        newFollow.followerId = new ObjectId(String(followerId))
        newFollow.createdAt = newFollow.updatedAt = new Date()
        return await this.collection().insertOne(newFollow)
    }
}

module.exports = Follow