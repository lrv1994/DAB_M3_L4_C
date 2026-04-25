const { sequelize } = require("../models");
const { QueryTypes } = require('sequelize');

class HotelService {
    constructor(db) {
        this.client = db.sequelize;
    }

    // Create a hotel using raw SQL
    async create(name, location) {
        return sequelize.query(
            'INSERT INTO Hotels (Name, Location) VALUES (:Name, :Location)',
            {
                replacements: { Name: name, Location: location }
            }
        );
    }

    // Get all hotels using raw SQL
    async get() {
        const hotels = await sequelize.query(
            'SELECT * FROM Hotels',
            { type: QueryTypes.SELECT }
        );
        return hotels;
    }

    // Get hotel details using raw SQL
    async getHotelDetails(hotelId, userId) {
        // Retrieve hotel data
        const hotel = await sequelize.query(
            'SELECT h.id, h.Name, h.Location, ROUND(AVG(r.Value), 1) AS AvgRate ' +
            'FROM Hotels h LEFT JOIN Rates r ON h.id = r.HotelId ' +
            'WHERE h.id = :hotelId',
            {
                replacements: { hotelId },
                type: QueryTypes.SELECT
            }
        );

        // Retrieve user rating count
        const userRateCount = await sequelize.query(
            'SELECT COUNT(*) as Rated FROM Rates WHERE HotelId = :hotelId AND UserId = :userId',
            {
                replacements: { hotelId, userId },
                type: QueryTypes.SELECT
            }
        );

        // Check if user has rated this hotel
        hotel[0].Rated = userRateCount[0].Rated > 0;

        return hotel[0];
    }

    // Delete a hotel using raw SQL
    async deleteHotel(hotelId) {
        return sequelize.query(
            'DELETE FROM Hotels WHERE id = :hotelId',
            {
                replacements: { hotelId }
            }
        );
    }

    // Rate a hotel using raw SQL
    async makeARate(userId, hotelId, value) {
        return sequelize.query(
            'INSERT INTO Rates (Value, HotelId, UserId) VALUES (:value, :hotelId, :userId)',
            {
                replacements: { userId, hotelId, value }
            }
        );
    }
}

module.exports = HotelService;