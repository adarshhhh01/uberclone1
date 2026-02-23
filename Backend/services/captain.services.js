const captianModel = require('../models/captain.model')




module.exports.createCaptain = async ({firstName, email, password, color, plate, vehicleType, capacity}) => {
   if(!firstName || !email || !password || !color || !plate || !vehicleType || !capacity)
   {
       throw new Error('All fields are required');
   }
    const captain = await captianModel.create({
        fullName: {
            firstName,
            lastName: '' // Optional field, can be left empty
        },
        email,
        password,
        vehicleDetails: {
            color,
            plate,
            vehicleType,
            capacity
        }
    })
    return captain;

}
