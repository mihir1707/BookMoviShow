import { City } from "../models/city.model.js";
import APIresponse from "../utils/APIresponse.js";
import asyncHandler from "../utils/asyncHandler.js";


const getAllCities = asyncHandler( async(req, res) => {

    const cities = await City.find({})
        .select("cityId name state region cinemaCount latitude longitude country")
        .sort({ name: 1 });

    return res.status(200)
    .json(
        new APIresponse(
            200,
            cities,
            "Cities fetched successfully",
        )
    )
})

const searchCity = asyncHandler( async(req, res) => {

    const query = (req.query.city || req.query.query)?.trim();

    if(!query){
        return res.status(400)
        .json(
            new APIresponse(
                400,
                {},
                "City query is required",
            )
        )
    }

    const cities = await City.find({
        name: {
            $regex: `^${query}`,
            $options: "i",
        }
    })
    .select("cityId name state cinemaCount")
    .limit(10)
    .sort({ name: 1 });

    return res.status(200)
    .json(
        new APIresponse(
            200,
            cities,
            "Cities fetched successfully",
        )
    )
})

const getCityById = asyncHandler( async(req, res) => {

    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json(
            new APIresponse(400, {}, "Invalid city ID")
        );
    }

    const city = await City.findById(id);

    if(!city){
        return res.status(404)
        .json(
            new APIresponse(
                404,
                {},
                "City not found",
            )
        )
    }

    return res.status(200)
    .json(
        new APIresponse(
            200,
            city,
            "City fetched successfully",
        )
    )
})

export {
    getAllCities,
    searchCity,
    getCityById,
}