// app.js
$(document).ready(function() {
    
    AWS.config.update({
        region: 'us-east-1', // e.g., 'us-east-1'
        accessKeyId: 'AKIA5HURSVIUQFRAJONP',
        secretAccessKey: 'JLfYWqAif+MNEMl2IebnIYtFS0PjuRsYunsVRn44'
    });

    const dynamodb = new AWS.DynamoDB();
    
    const docClient = new AWS.DynamoDB.DocumentClient();
    // DynamoDB table name
    const tableName = 'projectDMS';

    // Show the login form by default and hide the sign-up form
    //$('#signUpForm').hide();

    // Switch to the sign-up form when "Sign Up" button is clicked
    $('#goToSignUp').click(function() {
        $('#loginForm').hide();
        $('.signup-form').show();
        $('#loginContainer').hide();
    });
    $('#logoutButton').click(function () {
        // Reset the login state by hiding the user details screen and showing the login form
        location.reload();
      });

      $('.logout-signup').click(function () {
        // Reset the login state by hiding the user details screen and showing the login form
        location.reload();
      });

    $('#loginForm').submit(function(event) {
        event.preventDefault();
        //const username = $('#loginUsername').val();
        const password = $('#loginPassword').val();
        const organizationCode = $('#loginOrganizationCode').val();
        const organizationEmail = $('#loginOrganizationEmail').val();
        // Call function to check credentials and perform login
        login(organizationCode, password,organizationEmail);
    });
    
    $('#sos-btn').click(function(event) {
      console.log("I'm in");
      $('#loginContainer').hide();
        $('#loginForm').hide()
        // Show the user details screen
        $('#sos-container').show();
        $('.login-signup').show();
        $('#button-container').hide();
        $('.signup-form').hide();
      const password = $('#loginPassword').val();
      const organizationCode = $('#loginOrganizationCode').val();
      const organizationEmail = $('#loginOrganizationEmail').val();
      // Call function to check credentials and perform login
      sosDetails(organizationCode, password,organizationEmail);
  });

  $('#dms-btn').click(function(event) {
    console.log("I'm in dms");
    $('#loginContainer').hide();
      $('#loginForm').hide()
      // Show the user details screen
      $('.page-content').show();
      $('.login-signup').show();
      $('#button-container').hide();
      $('.signup-form').hide();
    //const password = $('#loginPassword').val();
    //const organizationCode = $('#loginOrganizationCode').val();
    //const organizationEmail = $('#loginOrganizationEmail').val();
    // Call function to check credentials and perform login
    //sosDetails(organizationCode, password,organizationEmail);
});
$('.login-signup').click(function(event) {
  console.log("I'm in dms");
  $('#loginContainer').hide();
    $('#loginForm').hide()
    // Show the user details screen
    $('.page-content').hide();
    $('#button-container').show();
    $('#sos-container').hide();
    $('.signup-form').hide();
    $('.login-signup').hide();
  //const password = $('#loginPassword').val();
  //const organizationCode = $('#loginOrganizationCode').val();
  //const organizationEmail = $('#loginOrganizationEmail').val();
  // Call function to check credentials and perform login
  //sosDetails(organizationCode, password,organizationEmail);
});
    $('#alertButton').click(function () {
        const message = "This is an alert message!"; // Replace with your desired alert message
        const phoneNumber = $('#userDetailsContactNumber').text();
    
        // Call function to publish the alert message
        publishAlertMessage(message, phoneNumber);
      });
    // Switch to the login form when "Back to Login" button is clicked
    $('#goToLogin').click(function() {
      location.reload();
    });

    $('#signUpForm').submit(function(event) {
        event.preventDefault();
        const username = $('#signupUsername').val();
        const password = $('#signupPassword').val();
        

        // Call function to save user credentials and perform sign-up
        signUp(username, password);
    });
    $('#sosButton').click(function() {
        const contactNumber = $('#userDetailsContactNumber').text();
        const organizationEmail = $('#userDetailsOrganizationEmail').text();
        addNumberToSandbox(contactNumber,organizationEmail);
    });
    $('#accident-btn').click(function () {
        //const message = "Accident SOS alert!"; // Replace with your desired alert message
        

        //const phoneNumber = $('#userDetailsContactNumber').text();
        const organizationCode = $('#userDetailsOrganizationCode').text();
        const emergencyContact =  $('#userDetailsContactNumber').text();
        const emergencyContactName =  $('#userDetailsUsername').text();
        const message = "Accident SOS alert! " + emergencyContactName + " needs assistance."; 
        alert('Accident SOS Request Sent.');
        document.getElementById('cancel-div').style.display = 'block';
        startCancelRequestTimer();
    
        // Call function to publish the alert message
        publishAlertMessage(message, organizationCode,emergencyContact);
      });

      $('#fire-btn').click(function () {
        //const message = "Fire SOS alert!"; // Replace with your desired alert message
        //const phoneNumber = $('#userDetailsContactNumber').text();
        const organizationCode = $('#userDetailsOrganizationCode').text();
        const emergencyContact =  $('#userDetailsContactNumber').text();
        const emergencyContactName =  $('#userDetailsUsername').text();
        const message = "Fire SOS alert! " + emergencyContactName + " needs assistance."; 
        alert('Fire SOS Request Sent.');
        document.getElementById('cancel-div').style.display = 'block';
        startCancelRequestTimer();
    
        // Call function to publish the alert message
        publishAlertMessage(message, organizationCode,emergencyContact);
      });

      $('#medical-btn').click(function () {
        //const message = "Medical SOS alert!"; // Replace with your desired alert message
        //const phoneNumber = $('#userDetailsContactNumber').text();
        const organizationCode = $('#userDetailsOrganizationCode').text();
        const emergencyContact =  $('#userDetailsContactNumber').text();
        const emergencyContactName =  $('#userDetailsUsername').text();
        const message = "Medical SOS alert! " + emergencyContactName + " needs assistance."; 
        alert('Medical SOS Request Sent.');
        document.getElementById('cancel-div').style.display = 'block';
        startCancelRequestTimer();
    
        // Call function to publish the alert message
        publishAlertMessage(message, organizationCode,emergencyContact);
      });
   
      function cancelRequest() {
        // Implement the logic to cancel the SOS request here.
        // This function will be called when the cancel button is clicked or after the timer runs out.
        // You can show a confirmation message to the user, or perform any necessary actions.
        alert('SOS Request Cancelled.');
        clearInterval(cancelRequestTimer);
        const message = "SOS Request Cancelled."; // Replace with your desired alert message
        //const phoneNumber = $('#userDetailsContactNumber').text();
        const organizationCode = $('#userDetailsOrganizationCode').text();
        const emergencyContact =  $('#userDetailsContactNumber').text();
        publishAlertMessage(message, organizationCode,emergencyContact);
        document.getElementById('cancel-div').style.display = 'none';
      }
      





      function publishAlertMessage(message, organizationCode,emergencyContact) {

        const params = {
          TableName: tableName,
          IndexName: 'organizationCodeIndex', // Replace 'OrganizationCodeIndex' with the name of the index on 'organizationCode' attribute (if you have one)
          KeyConditionExpression: 'organizationCode = :orgCode',
          ExpressionAttributeValues: {
              ':orgCode': organizationCode
          },
          ProjectionExpression: 'contactNumber'
      };
  
      docClient.query(params, function (err, data) {
          if (err) {
              console.error('Error retrieving contact numbers:', err);
              // Handle the error if needed
          } else {
              const contactNumbers = data.Items.map((item) => item.contactNumber);
              contactNumbers.push(emergencyContact);
              console.log(contactNumbers);
              AWS.config.update({
                region: 'us-east-1' // Replace 'your-desired-region' with the desired AWS region, e.g., 'us-west-2'
            });
              //console.log('Contact Numbers for Organization Code', organizationCode, ':', contactNumbers);
              // Perform any further processing or actions with the contact numbers
              const sns = new AWS.SNS();
    
              // Create a promise to publish the alert message for each phone number in the array
              const publishPromises = contactNumbers.map(phoneNumber => {
                  const params = {
                      Message: message,
                      PhoneNumber: phoneNumber
                  };
          
                  return sns.publish(params).promise();
              });
          
              // Use Promise.all to execute all publish promises concurrently
              Promise.all(publishPromises)
                  .then(data => {
                      console.log('Alert messages published successfully:', data);
                      // Add any additional handling or notifications here
                  })
                  .catch(err => {
                      console.error('Error publishing the alert messages:', err);
                  });
          }
      });


       
    }
    

      var originalStyle;
      function resetStyle() {
        var myDiv = document.getElementById("loginContainer");
        originalStyle = myDiv.getAttribute("style");
        myDiv.removeAttribute("style");
      }

  
    function addNumberToSandbox(contactNumber,organizationEmail) {
        const sns = new AWS.SNS();
      
        // Step 1: Create the phone number in the SMS Sandbox
        const createParams = {
          PhoneNumber: contactNumber
        };
      
        sns.createSMSSandboxPhoneNumber(createParams, function (err, data) {
          if (err) {
            console.error('Error creating sandbox phone number:', err);
          } else {
            console.log('Successfully created sandbox phone number:', data);
      
            // Step 2: Verify the phone number using the verification code
            const verificationCode = prompt('Enter the verification code received on your phone:'); // You can use any method to get the verification code from the user.
      
            // Verify the phone number
            const verifyParams = {
              PhoneNumber: contactNumber,
              OneTimePassword: verificationCode
            };
      
            sns.verifySMSSandboxPhoneNumber(verifyParams, function (err, data) {
              if (err) {
                console.error('Error verifying phone number:', err);
                
              } else {
                console.log('Phone number verification successful!', data);
                const phoneNumberVerified = 'true'
                
                const params = {
                  TableName: tableName,
                  Key: {
                    'organizationEmail': organizationEmail
                  },
                  UpdateExpression: 'SET phoneNumberVerified = :newphoneNumberVerified',
                  ExpressionAttributeValues: {
                    ':newphoneNumberVerified': phoneNumberVerified
                  }
                  
                };
              // Perform the update
              docClient.update(params, function (err, data) {
                if (err) {
                  console.error('Error updating item in DynamoDB:', err);
                } else {
                  console.log('Item updated successfully:', data.Attributes);
                  // Perform any additional handling or notifications here
                  // After the successful update, you can disable the "Verify" button
                  $('#sosButton').prop('disabled', true);
                }
              });
                // Do any additional handling or notifications here
              }
            });
          }
        });
      }
      

    function login(organizationCode, password,organizationEmail) {
        const params = {
            TableName: tableName,
            Key: {
                
                'organizationEmail': { S: organizationEmail } 
            }
        };

        dynamodb.getItem(params, function(err, data) {
            if (err) {
                console.error("Error retrieving item from DynamoDB:", err);
                return;
            }

            if (data.Item.password.S === password && data.Item.organizationEmail.S === organizationEmail) {
              alert('Logged in successfully');
                // Fetch the Contact Number from the retrieved data
            const contactNumber = data.Item.contactNumber.S;
            const emergencyContactNumber = data.Item.emergencyContactNumber.S;
            const phoneNumberVerified = data.Item.phoneNumberVerified.S;
            const username = data.Item.username.S;

            const params = {
              TableName: tableName,
              IndexName: 'organizationCodeIndex', // Replace 'OrganizationCodeIndex' with the name of the index on 'organizationCode' attribute (if you have one)
              KeyConditionExpression: 'organizationCode = :orgCode',
              ExpressionAttributeValues: {
                  ':orgCode': organizationCode
              },
              ProjectionExpression: 'contactNumber'
          };
      
          docClient.query(params, function (err, data) {
              if (err) {
                  console.error('Error retrieving contact numbers:', err);
                  // Handle the error if needed
              } else {
                const contactNumbers = data.Items.map((item) => item.contactNumber);
                  console.log('Contact Numbers for Organization Code', organizationCode, ':', contactNumbers);
                  // Perform any further processing or actions with the contact numbers
              }
          });
          
            // Show the user details screen with the fetched details
            showHomePage();
            
            //showUserDetails(username, organizationCode, contactNumber, organizationEmail,emergencyContactNumber,phoneNumberVerified);
                // Redirect the user to the authenticated page or perform other actions.
            } else {
              window.alert('Invalid credentials. Please try again.');
               
            }
        });
    }
    function showUserDetails(username, organizationCode, contactNumber, organizationEmail,emergencyContactNumber,phoneNumberVerified) {
        // Hide the login screen
        //$('#loginContainer').hide();
        //$('#loginForm').hide()
        // Show the user details screen
        //$('#userDetailsContainer').show();
        //$('#button-container').hide();
        //$('.signup-form').hide();
        

      

    // Set the "Verify" button's disabled property based on phoneNumberVerified status
        //$('#sosButton').prop('disabled', phoneNumberVerified === 'true');
        // Display the user details
        $('#userDetailsUsername').text(username);
        $('#userDetailsOrganizationCode').text(organizationCode);
        $('#userDetailsOrganizationEmail').text(organizationEmail);
        $('#userDetailsNumber').text(contactNumber);
        $('#userDetailsVerify').text(phoneNumberVerified);
        $('#userDetailsContactNumber').text(emergencyContactNumber); // Display the fetched contact number
    }

    function showHomePage(){
      
      $('#loginContainer').hide();
        $('#loginForm').hide()
        $('.logout-signup').show()
        // Show the user details screen
        $('#button-container').show();
        $('.signup-form').hide();
    }

    function sosDetails(organizationCode, password,organizationEmail) {
      const params = {
          TableName: tableName,
          Key: {
              
              'organizationEmail': { S: organizationEmail } 
          }
      };

      dynamodb.getItem(params, function(err, data) {
          if (err) {
              console.error("Error retrieving item from DynamoDB:", err);
              return;
          }

          if (data.Item.password.S === password && data.Item.organizationEmail.S === organizationEmail) {
              
              
              // Fetch the Contact Number from the retrieved data
          const contactNumber = data.Item.contactNumber.S;
          const emergencyContactNumber = data.Item.emergencyContactNumber.S;
          const phoneNumberVerified = data.Item.phoneNumberVerified.S;
          const username = data.Item.username.S;

          const params = {
            TableName: tableName,
            IndexName: 'organizationCodeIndex', // Replace 'OrganizationCodeIndex' with the name of the index on 'organizationCode' attribute (if you have one)
            KeyConditionExpression: 'organizationCode = :orgCode',
            ExpressionAttributeValues: {
                ':orgCode': organizationCode
            },
            ProjectionExpression: 'contactNumber'
        };
    
        docClient.query(params, function (err, data) {
            if (err) {
                console.error('Error retrieving contact numbers:', err);
                // Handle the error if needed
            } else {
              const contactNumbers = data.Items.map((item) => item.contactNumber);
                console.log('Contact Numbers for Organization Code', organizationCode, ':', contactNumbers);
                // Perform any further processing or actions with the contact numbers
            }
        });
  
          // Show the user details screen with the fetched details
          
          showUserDetails(username, organizationCode, contactNumber, organizationEmail,emergencyContactNumber,phoneNumberVerified);
              // Redirect the user to the authenticated page or perform other actions.
          } else {
            
              console.log("something went wrong!");
          }
      });
  }



    function signUp(username, password) {
        const organizationCode = $('#organizationCode').val();
        const contactNumber = $('#contactNumber').val();
        const organizationName = $('#organizationName').val();
        const organizationEmail = $('#organizationEmail').val();
        const organizationType = $('#organizationType').val();
        const emergencyContactName = $('#emergencyContactName').val();
        const emergencyContactNumber = $('#emergencyContactNumber').val();
        const phoneNumberVerified = 'false'
        const params = {
            TableName: tableName,
            Item: {
                'username': { S: username },
                'password': { S: password },
                'organizationCode': { S: organizationCode },
                'contactNumber': { S: contactNumber },
                'organizationName': { S: organizationName },
                'organizationEmail': { S: organizationEmail },
                'organizationType': { S: organizationType },
                'emergencyContactName': { S: emergencyContactName },
                'emergencyContactNumber': { S: emergencyContactNumber },
                'phoneNumberVerified': { S: phoneNumberVerified }
              
            }
        };
    
        dynamodb.putItem(params, function(err, data) {
            if (err) {
                console.error("Error saving item to DynamoDB:", err);
                return;
            }
            alert("User registered successfully!");
            console.log("User registered successfully!");
            location.reload();
            // You may redirect the user to the login page or perform other actions.
        });
    }


    let cancelRequestTimer;

    function startCancelRequestTimer() {
      const cancelBtn = document.getElementById('cancel-btn');
      let timer = 180; // 3 minutes in seconds

      function updateTimer() {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        cancelBtn.textContent = `Cancel Request (${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')})`;

        if (timer <= 0) {
          cancelRequest();
          return;
        }

        timer--;
      }

      cancelRequestTimer = setInterval(updateTimer, 1000);
    }

    

    

    

    document.getElementById('cancel-btn').addEventListener('click', () => {
      cancelRequest();
    });


































});
