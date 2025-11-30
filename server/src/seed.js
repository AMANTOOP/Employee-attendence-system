require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Attendance = require("./models/Attendance");
const attendanceService = require("./services/attendance.service");

const MONGO_URI = process.env.MONGO_URI;
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

// ------------- Departments -------------
const departments = ["IT", "HR", "Finance", "Marketing", "Support"];

// ------------- Random Helpers -------------
const randomFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomLateCheckIn = () => {
  const baseHour = 9;
  const randomMinute = Math.floor(Math.random() * 45); // up to 45 mins late
  const date = new Date();
  date.setHours(baseHour, randomMinute, 0, 0);
  return date;
};

const randomOnTimeCheckIn = () => {
  const date = new Date();
  date.setHours(9, Math.floor(Math.random() * 5), 0, 0); // 9:00–9:05
  return date;
};

const randomCheckout = () => {
  const date = new Date();
  const hour = 17 + Math.floor(Math.random() * 2); // 5PM to 6PM
  date.setHours(hour, Math.floor(Math.random() * 30), 0, 0);
  return date;
};

// ------------- Seeder -------------
async function seed() {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected");

    // OPTIONAL: Uncomment to clear old data
    // await User.deleteMany({});
    // await Attendance.deleteMany({});
    // console.log("🗑 Existing data cleared");

    // ---------------------------
    // 1. Create Manager
    // ---------------------------
    const managerEmail = "manager@test.com";
    let manager = await User.findOne({ email: managerEmail });

    if (!manager) {
      const hashed = await bcrypt.hash("123456", SALT_ROUNDS);
      manager = await User.create({
        name: "Manager User",
        email: managerEmail,
        password: hashed,
        role: "manager",
        employeeId: "MGR10001",
        department: "Management",
      });
      console.log("👑 Manager created");
    }

    // ---------------------------
    // 2. Create Employees
    // ---------------------------
    const employees = [];
    for (let i = 1; i <= 8; i++) {
      const email = `employee${i}@test.com`;

      let emp = await User.findOne({ email });
      if (!emp) {
        const hashed = await bcrypt.hash("123456", SALT_ROUNDS);
        emp = await User.create({
          name: `Employee ${i}`,
          email,
          password: hashed,
          role: "employee",
          employeeId: `EMP10${i}`,
          department: randomFromArray(departments),
        });
        console.log(`👤 Employee ${i} created`);
      }
      employees.push(emp);
    }

    // ---------------------------
    // 3. Generate Attendance for last 30 days
    // ---------------------------
    console.log("📅 Creating attendance...");

    const today = new Date();

    for (const emp of employees) {
      for (let d = 0; d < 30; d++) {
        const date = new Date(today);
        date.setDate(today.getDate() - d);
        const dateStr = attendanceService.formatDateStr(date);

        // Skip weekends (optional)
        if (date.getDay() === 0 || date.getDay() === 6) continue;

        const chance = Math.random();

        if (chance < 0.15) {
          // 15% absent
          await Attendance.create({
            userId: emp._id,
            date: dateStr,
            status: "absent",
          });
          continue;
        }

        // Present / Late / Half-day
        let checkIn;
        if (chance < 0.4) checkIn = randomOnTimeCheckIn();
        else checkIn = randomLateCheckIn();

        const checkOut = randomCheckout();

        let totalHours =
          (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);

        let status = "present";
        if (checkIn.getHours() >= 9 && checkIn.getMinutes() > 15) {
          status = "late";
        }
        if (totalHours < 4) {
          status = "half-day";
        }

        await Attendance.create({
          userId: emp._id,
          date: dateStr,
          checkInTime: checkIn,
          checkOutTime: checkOut,
          totalHours,
          status,
        });
      }
    }

    console.log("🎉 Dummy attendance created for 30 days");
    console.log("✔ Seeder completed successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeder Error:", err);
    process.exit(1);
  }
}

seed();
