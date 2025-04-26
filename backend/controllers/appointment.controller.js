const appointmentModel = require("../models/appointments");
require('dotenv').config();
const nodemailer=require('nodemailer');
const TimeTable = require("../models/timeTableModel");
const serviceModel = require("../models/serviceProvider.model");
const userModel = require("../models/user.model");
const cloudinary= require('../config/cloudinary');




const transporter= nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL,
        pass:process.env.EMAIL_PASS
    }
})
exports.sendAppointment = async (req, res) => {
  try {
    const { providerId, date, slot, user, userName, fees, address, img, number,image } = req.body;
    const images = req.file;
    let imgUrl = "";
    let servicePImage = "";

    // Parse address if sent as a stringified object
    let parsedAddress;
    try {
      parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;
    } catch (err) {
      return res.status(400).json({ message: "Invalid address format." });
    }

    
    if (!providerId || !date || !slot || !user || !parsedAddress || typeof parsedAddress !== 'object' || !image) {
      return res.status(400).json({ message: "Please provide all required data (providerId, date, slot, user, address as an object)." });
    }

    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format." });
    }

    const existingAppointment = await appointmentModel.findOne({
      providerId,
      date: appointmentDate,
      slot,
      user
    });

    if (existingAppointment && existingAppointment.status === "pending") {
      return res.status(409).json({ message: "Appointment already exists and is pending.", success: false });
    }

    const newAppointment = new appointmentModel({
      providerId,
      date: appointmentDate,
      slot,
      user,
      userName,
      status: "pending",
      fees,
      address: parsedAddress,
      img,
      number,
      serviceProviderImage: image
    });

    await newAppointment.save();
    res.json({ message: "Appointment successfully saved!", success: true });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error occurred while saving the appointment", success: false, error: err.message });
  }
};

exports.getAppointments =async(req,res)=>{
    try{
        const {providerId}=req.query;

        if(!providerId){
            return res.status(400).json({message:"Provider ID is required!!", success:false})
        }

        const checkAppointment= await appointmentModel.find({providerId:providerId, status: 'pending'});

        if( !checkAppointment){
            return res.json({message:"No Appointments", success:true, data:{}})
        }

        res.status(200).json({ data:checkAppointment, success:true})
    }catch(err){
        res.status(500).json({message:"Error in confirm appointment", success:false})
    }
}
exports.statusAppointment = async (req, res) => {
  try {
    const { serviceProvider, slot, date, userEmail, appointmentId, status, providerId, userId } = req.body;

    const Appoint = await appointmentModel.findById(appointmentId);
    if (!Appoint) {
      return res.status(404).json({ message: "Appointment Not Found", success: false });
    }

    const updateStatus = status === "rejected" ? "rejected" : "accepted";

    // Update appointment status
    const updatedAppointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { $set: { status: updateStatus } },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(500).json({ message: "Failed to update appointment", success: false });
    }

    const providerSchedule = await TimeTable.findOne({ providerId });
    if (!providerSchedule) {
      return res.status(404).json({ message: "Provider Schedule Not Found", success: false });
    }

    const dayOfWeek = new Date(date).toLocaleString('en-US', { weekday: "long" });
    const timeSlot = providerSchedule.schedule[dayOfWeek]?.find(
      t => t.time === slot && (!t.bookingDate || t.bookingDate.toISOString().split('T')[0] !== date)
  );

  if (!timeSlot) {
      console.log("Time slot not available for this date.");
      return;
  }

    if (status === "accepted") {
      await appointmentModel.updateMany(
        { providerId, date, status: "pending", _id: { $ne: appointmentId } },
        { $set: { status: "rejected" } }
      );

      timeSlot.isBooked = true;
      timeSlot.bookedBy = userId;
      timeSlot.bookingDate = new Date(date);
    } else if (status === "rejected") {
      timeSlot.isBooked = false;
      timeSlot.bookedBy = null;
      timeSlot.bookingDate = null;
    }

    // Save updated schedule
    await providerSchedule.save();

    // Construct email message
    const subject = status === "rejected" ? "Appointment Rejected" : "Appointment Accepted";
    const emailHtml = `
  
  <html>
    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); max-width: 650px; margin: auto;">
        
        <h2 style="color: #ff6347; font-size: 24px; text-align: center; font-weight: bold;">${subject}</h2>
        
        <p style="font-size: 16px; color: #555; text-align: center; margin-bottom: 20px;">
          Your appointment has been <strong style="color: ${status === 'completed' ? '#28a745' : '#e74c3c'}">${status}</strong>. Below are the details:
        </p>
        
        <div style="background-color: #f0f8ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="font-size: 16px; color: #333; font-weight: bold;">Service Provider:</p>
          <p style="font-size: 16px; color: #555;">${serviceProvider}</p>
          
          <p style="font-size: 16px; color: #333; font-weight: bold;">Appointment Date & Time:</p>
          <p style="font-size: 16px; color: #555;">
            <span style="font-weight: bold; color: #333;">
              ${new Date(date).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span style="font-size: 18px; font-weight: bold; color: #ff6347;"> at ${slot}</span>
          </p>
        </div>
        
        <p style="font-size: 16px; color: #555;">If you have any questions, please contact us.</p>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="mailto:gharkaam01@yourcompany.com" style="background-color: #ff6347; color: #ffffff; padding: 12px 20px; border-radius: 8px; font-size: 16px; text-decoration: none; font-weight: bold;">Contact Support</a>
        </div>
        
        <p style="font-size: 16px; color: #555; text-align: center;">Best regards,</p>
        <p style="font-size: 16px; color: #555; text-align: center;">Your Team</p>
        
      </div>
    </body>
  </html>
`;


    

    // Send Email
    const mailOptions = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: subject,
      html: emailHtml,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Failed to send email", success: false });
      } else {
        console.log("Email sent:", info.response);
        return res.status(200).json({
          message: `Appointment ${status} and email sent successfully.`,
          success: true,
        });
      }
    });

  } catch (err) {
    console.error("Error in statusAppointment:", err.message);
    return res.status(500).json({ message: "Error in updating appointment", success: false });
  }
};

  exports.historyAppointments = async (req, res) => {
    try {
      // Access query parameters using req.query
      // const { serviceProviderId, userId } = req.query; 

      const { serviceProviderId, userId } = req.params
  
      console.log('Received providerId:', serviceProviderId);
      console.log('Received userId:', userId);
  
      if (!serviceProviderId || !userId) {
        return res.status(400).json({ message: "Please provide both service provider id and user id", success: false });
      }
  
      // Continue with appointment fetching logic
      const checkHistory = await appointmentModel.find({
        providerId: serviceProviderId,
        user: userId,
        status: { $in: ['completed', 'rejected'] },
      });
  
      if (!checkHistory || checkHistory.length === 0) {
        return res.status(404).json({ message: "No history found", success: false });
      }
  
      res.status(200).json({ data: checkHistory, success: true });
    } catch (err) {
      console.error("Error in historyAppointments:", err.message);
      return res.status(500).json({ message: "Error fetching history appointments", success: false });
    }
  };
  


  exports.sendAcceptedAppointment=async(req,res)=>{
    try{
        const {serviceProvider}=req.query;

        if(!serviceProvider){
          return res.status(400).json({message:"Please provide service provider",success:false});
        }
        const acceptedAppointments = await appointmentModel.find({
          providerId: serviceProvider,
          status: "accepted"
        });

        if(!acceptedAppointments || acceptedAppointments.length===0){
          return res.status(404).json({message:"No accepted appointment found",success:false});
        }

        res.status(200).json({data:acceptedAppointments,success:true})
    }catch(err){
      console.error("Error in sendAcceptedAppointment:", err.message);
      return res.status(500).json({ message: "Error sending accepted appointment", success: false});

    }
  }


  exports.sendAppointmentDetails=async(req,res)=>{
    try{
      const {appointmentId}=req.query;
      const appointmentDetails = await appointmentModel.findById(appointmentId);
      if(!appointmentDetails){
      return res.status(400).json({message:"No appointments", success:false});
      }

      res.status(200).json({data:appointmentDetails, success:true})

    }catch(err){
      console.error("Error in sendAppointmentDetails:", err.message);
      return res.status(500).json({ message: "Error sending appointment details", success: false});
    }
  }

  exports.finalStatus = async (req, res) => {
    try {
      const { appointmentId, status } = req.body;
      console.log("Received Request:", { appointmentId, status });
  
      if (!appointmentId || !status) {
        return res.status(400).json({ message: "Please send all the fields" });
      }
  
      // Find the appointment
      const findAppointment = await appointmentModel.findById(appointmentId);
      if (!findAppointment) {
        return res.status(404).json({ message: "No appointment found", success: false });
      }
  
      if (status !== "completed" && status !== "canceled") {
        return res.status(400).json({ message: "Invalid status value", success: false });
      }
  
      // Update the appointment status
      findAppointment.status = status;
      await findAppointment.save();
  
      const { providerId, date, slot: timeSlot, user } = findAppointment;
      

      // Get the weekday from the booking date
      const dayOfWeek = new Date(date).toLocaleString("en-US", { weekday: "long" });
  
      // Find provider's timetable
      const timetable = await TimeTable.findOne({ providerId });
      if (!timetable) {
        return res.status(404).json({ message: "Provider's timetable not found", success: false });
      }
  
      // Check if schedule exists for the dayOfWeek
      if (!timetable.schedule || !timetable.schedule[dayOfWeek]) {
        return res.status(404).json({ message: `No schedule found for ${dayOfWeek}`, success: false });
      }
  
      // Find the exact time slot
      const foundSlot = timetable.schedule[dayOfWeek].find(
        (s) =>
          s.time === timeSlot &&
          s.bookingDate &&
          new Date(s.bookingDate).toISOString().split("T")[0] === new Date(date).toISOString().split("T")[0]
      );
  
      if (!foundSlot) {
        return res.status(404).json({ message: "Time slot not found in the timetable for the given date", success: false });
      }
  
      foundSlot.isBooked = false;
      foundSlot.bookedBy = null;
      foundSlot.bookingDate = null;
      await timetable.save();

      const serviceProvider = await serviceModel.findById(providerId);
      const {slot}=findAppointment;
if (!serviceProvider) {
  console.log("Service provider not found");
  return res.status(404).json({ message: "Service provider not found", success: false });
}

const findUser =await userModel.findById(user);
if(!findUser){
  console.log("User not found");
  return res.status(404).json({ message: "User not found", success: false });
}

const userEmail= findUser.email;
console.log("UserEmail",userEmail);

 const servicePName= `${serviceProvider.firstName} ${serviceProvider.middleName|| ""} ${serviceProvider.lastName}`;
 const servicePservice=`${serviceProvider.speciality}`
      const subject = status === "completed" ? "Appointment Completed" : "Appointment Rejected";
      const emailHtml = `
    <html>
  <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
    <div style="max-width: 650px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);">
      
      <!-- Header Section -->
      <div style="text-align: center; padding: 20px;">
        <h2 style="color: #333333; font-size: 24px; font-weight: bold;">Appointment Status Update</h2>
        <p style="color: #777777; font-size: 16px;">Here are the details of your appointment:</p>
      </div>

      <!-- Main Content -->
      <div style="padding: 20px; background-color: #f2f2f2; border-radius: 8px;">
        <p style="font-size: 16px; color: #333333; font-weight: bold;">Status:  <span style="color: ${status === 'completed' ? 'green' : 'red'};">
    ${status}
  </span></p>
        <p style="font-size: 16px; color: #333333; font-weight: bold;">Service Provider: <span style="color: #555555;">${servicePName}</span></p>
        <p style="font-size: 16px; color: #333333; font-weight: bold;">Service: <span style="color: #555555;">${servicePservice}</span></p>
        
        <!-- Appointment Date and Time -->
        <p style="font-size: 16px; color: #333333; font-weight: bold;">Appointment Date & Time:</p>
        <p style="font-size: 16px; color: #777777;">
          <strong style="color: #333333;">
            ${new Date(date).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </strong> at <strong style="color: #2c3e50;">${slot}</strong>
        </p>
      </div>

      <!-- Footer Section -->
      <div style="padding: 20px; text-align: center; background-color: #e1e1e1; color: #333333; border-radius: 8px; margin-top: 20px;">
        <p style="font-size: 16px; margin-bottom: 10px;">If you have any questions, feel free to contact us:</p>
        <a href="mailto:gharkaam@gmail.com" style="background-color: #2c3e50; color: white; padding: 10px 20px; font-size: 16px; border-radius: 8px; text-decoration: none; font-weight: normal;">
          Contact Support
        </a>
      </div>

      <!-- Closing Section -->
      <div style="text-align: center; margin-top: 20px;">
        <p style="font-size: 14px; color: #777777;">Best regards,</p>
        <p style="font-size: 14px; color: #777777;">Your Team at GharKaam</p>
      </div>
      
    </div>
  </body>
</html>


      `;
  
      // Send the email
      const mailOptions = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: subject,
        html: emailHtml,
      };
  
      // Send email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).json({ message: "Failed to send email", success: false, error: error.message });
        } else {
          console.log("Email sent:", info.response);
          return res.status(200).json({
            message: `Appointment ${status} and email sent successfully.`,
            success: true,
          });
        }
      });
    } catch (err) {
      console.error("Error in finalStatus:", err);
      res.status(500).json({ message: "Error in final status", error: err.message });
    }
  };
  


  exports.getCompletedAppointments = async (req, res) => {
    try {
      const { providerId } = req.query;
  
      if (!providerId) {
        return res.status(400).json({ message: "Provider ID is required", success: false });
      }

      const getCompletedAppointments = await appointmentModel.find({
        providerId: providerId,
        status: "completed"
      });

      if (getCompletedAppointments.length === 0) {
        return res.status(404).json({ message: "No completed appointments found", success: false });
      }

      res.status(200).json({ data: getCompletedAppointments, success: true });
    } catch (err) {
      console.error("Error in getCompletedAppointments:", err);
      res.status(500).json({ message: "Error in getting completed appointments", error: err.message });
    }
  };


  
  exports.sendBookings=async(req,res)=>{
    try{
      const {userId}=req.query;

      if(!userId){
        return res.status(400).json({message:"Please provide user ID",success:false});
      }

      const getData= await appointmentModel.find({user:userId});

      
      const serviceProviderId = getData[0]?.providerId; // Safe access
    if (!serviceProviderId) {
      return res.status(404).json({ message: "Provider ID not found in appointments", success: false });
    }

    console.log("Provi", serviceProviderId); // Debugging: Check providerId

      const getProvider= await serviceModel.find({_id:serviceProviderId});
      res.status(200).json({data:getData, success:true, service:getProvider})
      
    }catch(err){
      console.error("Error in sendBookings:", err.message);
      res.status(500).json({message:"Error in sendBookings", success:false})
    }
  }


  

  