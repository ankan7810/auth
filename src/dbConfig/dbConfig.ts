import mongoose from 'mongoose';

export async function connect() {
    try {
        //"connect" method accept a string .Here we ensure that we also got a string. 
        mongoose.connect(process.env.MONGO_URI!);
        //we hold in connection variable cuzz if issue occure after a connection then we check it.
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        })

        connection.on('error', (err) => {
            console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
            process.exit();
        })

    } catch (error) {
        console.log('Something goes wrong!');
        console.log(error);
        
    }


}