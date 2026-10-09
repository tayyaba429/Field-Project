// STUDENT REGISTER

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            // GET VALUES

            const name =
                document.getElementById("name").value.trim();

            const studentId =
                document.getElementById("studentId").value.trim();

            const email =
                document.getElementById("email").value.trim();

            const password =
                document.getElementById("password").value;

            const confirmPassword =
                document.getElementById("confirmPassword").value;

            // VALIDATE EMPTY FIELDS

            if (
                !name ||
                !studentId ||
                !email ||
                !password ||
                !confirmPassword
            ) {

                alert("Please fill all fields.");

                return;
            }

            // CHECK PASSWORD

            if (password !== confirmPassword) {

                alert("Passwords do not match.");

                return;
            }

            // GET USERS

            try {

                const users =
                    await getAllData("users");

                // CHECK EMAIL

                const existingEmail =
                    users.find(function (user) {

                        return (
                            user.email &&
                            user.email.toLowerCase() ===
                            email.toLowerCase()
                        );

                    });

                if (existingEmail) {

                    alert(
                        "This email is already registered."
                    );

                    return;
                }

                // CHECK STUDENT ID

                const existingStudent =
                    users.find(function (user) {

                        return (
                            user.studentId &&
                            user.studentId.toLowerCase() ===
                            studentId.toLowerCase()
                        );

                    });


                if (existingStudent) {

                    alert(
                        "This Student ID is already registered."
                    );

                    return;
                }

                // CREATE STUDENT

                const newUser = {

                    name: name,

                    studentId: studentId,

                    email: email,

                    password: password,

                    role: "student"

                };

                // SAVE STUDENT

                await addData(
                    "users",
                    newUser
                );

                alert(
                    "Registration successful!"
                );

                // GO TO LOGIN

                window.location.href =
                    "login.html";

            }

            catch (error) {

                console.error(
                    "Student registration error:",
                    error
                );

                alert(
                    "Registration failed."
                );

            }

        }
    );

}

// ADMIN REGISTER

const adminRegisterForm =
    document.getElementById(
        "adminRegisterForm"
    );

if (adminRegisterForm) {

    adminRegisterForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            // GET VALUES

            const name =
                document
                    .getElementById("adminName")
                    .value
                    .trim();

            const adminId =
                document
                    .getElementById("adminId")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("adminEmail")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("adminPassword")
                    .value;

            const confirmPassword =
                document
                    .getElementById("adminConfirmPassword")
                    .value;

            // VALIDATION

            if (
                !name ||
                !adminId ||
                !email ||
                !password ||
                !confirmPassword
            ) {

                alert(
                    "Please fill all fields."
                );

                return;
            }

            // CHECK PASSWORD

            if (
                password !==
                confirmPassword
            ) {

                alert(
                    "Passwords do not match."
                );

                return;
            }

            // GET EXISTING USERS

            try {

                const users =
                    await getAllData("users");

                // CHECK EMAIL

                const existingEmail =
                    users.find(function (user) {

                        return (
                            user.email &&
                            user.email.toLowerCase() ===
                            email.toLowerCase()
                        );

                    });


                if (existingEmail) {

                    alert(
                        "This email is already registered."
                    );

                    return;
                }

                // CHECK ADMIN ID

                const existingAdmin =
                    users.find(function (user) {

                        return (
                            user.studentId &&
                            user.studentId.toLowerCase() ===
                            adminId.toLowerCase()
                        );

                    });


                if (existingAdmin) {

                    alert(
                        "This Admin ID is already registered."
                    );

                    return;
                }

                // CREATE ADMIN USER

                const newAdmin = {

                    name: name,

                    studentId: adminId,

                    email: email,

                    password: password,

                    role: "admin"

                };

                // SAVE ADMIN

                await addData(
                    "users",
                    newAdmin
                );


                alert(
                    "Admin account created successfully!"
                );

                // GO TO LOGIN

                window.location.href =
                    "login.html";
            }

            catch (error) {

                console.error(
                    "Admin registration error:",
                    error
                );

                alert(
                    "Admin registration failed."
                );

            }

        }
    );

}

// LOGIN

const loginForm =
    document.getElementById(
        "loginForm"
    );


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            // GET LOGIN VALUES

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("password")
                    .value;

            // CHECK EMPTY FIELDS

            if (!email || !password) {

                alert(
                    "Please enter email and password."
                );

                return;
            }

            try {

                // GET USERS

                const users =
                    await getAllData("users");

                // FIND USER

                const user =
                    users.find(function (u) {

                        return (
                            u.email &&
                            u.email.toLowerCase() ===
                            email.toLowerCase() &&
                            u.password ===
                            password
                        );

                    });

                // INVALID LOGIN

                if (!user) {

                    alert(
                        "Invalid email or password."
                    );

                    return;
                }

                // SAVE LOGGED-IN USER

                localStorage.setItem(
                    "loggedInUser",
                    JSON.stringify(user)
                );


                console.log(
                    "Logged in user:",
                    user
                );
   
                // ROLE BASED REDIRECT
                
                if (
                    user.role ===
                    "student"
                ) {

                    window.location.href =
                        "dashboard.html";

                }

                else if (
                    user.role ===
                    "security"
                ) {

                    window.location.href =
                        "security-dashboard.html";

                }

                else if (
                    user.role ===
                    "admin"
                ) {

                    window.location.href =
                        "admin-dashboard.html";

                }

                else {

                    alert(
                        "Invalid user role."
                    );

                }

            }

            catch (error) {

                console.error(
                    "Login error:",
                    error
                );

                alert(
                    "Unable to login. Please try again."
                );

            }

        }
    );

}

// LOGOUT

function logout() {

    localStorage.removeItem(
        "loggedInUser"
    );

    window.location.href =
        "login.html";
}


// GET CURRENT USER

function getCurrentUser() {

    const user =
        localStorage.getItem(
            "loggedInUser"
        );


    if (!user) {

        return null;
    }


    try {

        return JSON.parse(user);

    }

    catch (error) {

        console.error(
            "Invalid logged-in user data:",
            error
        );

        localStorage.removeItem(
            "loggedInUser"
        );

        return null;
    }

}

// CHECK LOGIN

function checkLogin() {

    const user =
        getCurrentUser();


    if (!user) {

        window.location.href =
            "login.html";

        return null;
    }


    return user;

}

// CHECK STUDENT

function checkStudent() {

    const user =
        getCurrentUser();


    if (
        !user ||
        user.role !== "student"
    ) {

        alert(
            "Student access required."
        );

        window.location.href =
            "login.html";

        return false;
    }


    return true;

}

// CHECK SECURITY

function checkSecurity() {

    const user =
        getCurrentUser();


    if (
        !user ||
        user.role !== "security"
    ) {

        alert(
            "Security Staff access required."
        );

        window.location.href =
            "login.html";

        return false;
    }


    return true;

}

// CHECK ADMIN

function checkAdmin() {

    const user =
        getCurrentUser();


    if (
        !user ||
        user.role !== "admin"
    ) {

        alert(
            "Admin access required."
        );

        window.location.href =
            "login.html";

        return false;
    }

    return true;

}