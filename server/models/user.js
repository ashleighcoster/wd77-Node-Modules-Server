//email column - will store a 'string'; null = false 
//password column - will store as a 'string'; null = false 

module.exports = function(sequelize, DataTypes) {
    //sequelize.define = what is building our table -> define() is a sequelize method that will map model properities in the server file to a table in Postgres
    const User = sequelize.define('user', {

        email: { //email = column in the table 
            type: DataTypes.STRING, 
            allowNull: false, //will be unable to send an empty string through
            unique: true, //all emails must be unique and cannot have duplicates 
        },
        password: { //password = column in the table 
            type: DataTypes.STRING, 
            allowNull: false, 
        },
    });
    return User;
};