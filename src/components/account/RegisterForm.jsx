import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
  makeStyles,
} from "@material-ui/core";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { Loading } from "../MainComp/Loading";

const useStyles = makeStyles((theme) => ({
  paperStyle: {
    padding: 20,
    width: 500,
    margin: "20px auto",
    [theme.breakpoints.down(600)]: {
      width: "330px",
      minHeight: "50vh",
      maxHeight: "477px"
    },
    [theme.breakpoints.down(330)]: {
      width: "280px",
      maxHeight: "477px"
    },
    height: "70vh",
    overflow: "scroll",
  },
  headerStyle: {
    margin: 0,
  },
  avatarStyle: {
    backgroundColor: "#f5ba13",
  },

  btnstyle: {
    margin: "8px 0",
    backgroundColor: "#f5ba13",
    color: "white",
  },
}));

export const RegisterForm = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    localStorage.getItem("refresh") && history.push("/main");
  }, []);

  const [details, setDetails] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDetails((preDetail) => {
      return {
        ...preDetail,
        [name]: value,
      };
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setIsLoading(false);
    console.log(details);
    const register_details = {
      username: details.username,
      email: details.email,
      password: details.password,
    };

    if (
      details.password === details.confirmpassword &&
      details.password.length >= 6
    ) {
      axios
        .post(
          `https://rudrakshi-keeper-app.herokuapp.com/api/accounts/register/`,
          register_details
        )
        .then((res) => {
          setIsLoading(true);
          history.push("/");
        })
        .catch((err) => {
          setIsLoading(true);
          err.response.status === 400
            ? setError("User already exist!")
            : setError("Something went wrong!");
        });
    } else {
      setIsLoading(true);
      details.password.length < 6
        ? setError("Password must be at least 6 characters long!")
        : setError("Passwords do not match!");
    }
  };

  return (
    <div>
      {!isLoading ? (
        <Loading />
      ) : (
        <Grid>
          <Paper elevation={10} className={classes.paperStyle}>
            <Grid align="center">
              <Avatar className={classes.avatarStyle}>
                <AddCircleOutlineOutlinedIcon />
              </Avatar>
              <h2 className={classes.headerStyle}>Sign Up</h2>
              <Typography variant="caption" gutterBottom>
                Please fill this form to create an account !
              </Typography>
            </Grid>
            {error !== "" && <div style={{ color: "red" }}>{error}</div>}
            <TextField
              fullWidth
              style={{ margin: "10px 0" }}
              label="Name"
              name="username"
              value={details.username}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />

            <TextField
              fullWidth
              style={{ margin: "10px 0" }}
              label="Email"
              name="email"
              value={details.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />

            <TextField
              fullWidth
              style={{ margin: "10px 0" }}
              label="Password"
              name="password"
              type="password"
              value={details.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />

            <TextField
              fullWidth
              style={{ margin: "10px 0" }}
              label="Confirm Password"
              name="confirmpassword"
              type="password"
              value={details.confirmpassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />

            <Button
              type="submit"
              onClick={submitHandler}
              className={classes.btnstyle}
              variant="contained"
              color="primary"
            >
              Sign up
            </Button>

            <Typography>
              {" "}
              Already Registered ?<Link to="/">Sign In</Link>
            </Typography>
          </Paper>
        </Grid>
      )}
    </div>
  );
};
