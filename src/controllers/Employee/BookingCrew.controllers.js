import BookingCrew from "../../models/Employee/BookingCrew.js";
import Employee from "../../models/Employee/Employee.js";

export const getBookingCrew = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required" });
    }

    // Fetch crew along with employee details
    const crew = await BookingCrew.findAll({
      where: { bookingId },
      include: [
        {
          model: Employee,
          attributes: {
            exclude: ["password", "refreshToken"]
          }
        }
      ]
    });

    if (!crew || crew.length === 0) {
      return res.status(404).json({ message: "No crew assigned for this booking" });
    }

    return res.status(200).json({
      message: "Booking crew fetched successfully",
      crew
    });

  } catch (error) {
    console.error("FETCH CREW ERROR:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};
