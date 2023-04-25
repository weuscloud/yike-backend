const prisma = require('../prisma')
const createUser = async ({ name, phone_number, email, national_id, password_hash }) => {
  const user = await prisma.user.create({
    data: {
      name,
      phone_number,
      email,
      national_id,
      password_hash,
    },
    include: {
      Post: true,
      Comment: true,
    },
  })

  return user
}

module.exports = {
  createUser,
}
