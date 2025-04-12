import jwt from 'jsonwebtoken'

const genarateToken = (userId,res) => {
 const token = jwt.sign({userId},process.env.JWT_SECRET , {
    expiresIn : "15d" //how many days token stored in cookies
 })
 res.cookie("jwt",token , {
    maxAge : 15*24*60*1000,   //15days,24hours,60mins,1000secs
    httpOnly : true,   //prevent xss attacks
    sameSite : "strict",   //prevent CSRF attacks
    secure : process.env.NODE_ENV !== "development"
 })


}

export default genarateToken