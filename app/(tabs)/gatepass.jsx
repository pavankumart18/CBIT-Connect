import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StatusBar,
    ActivityIndicator,
    ScrollView,
    RefreshControl,
    Image,
  } from 'react-native';
  import React, { useState, useEffect, useRef } from 'react';
  import { useNavigation } from 'expo-router';
  import { Colors } from '../../constants/Colors';
  import { auth, db } from '../../configs/FireBaseConfigs';
  import {
    collection,
    addDoc,
    query,
    getDocs,
    where,
    doc,
    updateDoc,
  } from 'firebase/firestore';
  import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import QRCode from 'react-native-qrcode-svg';
  import { captureRef } from 'react-native-view-shot';
import { create } from 'react-test-renderer';
  
  export default function GatePass() {
    const navigation = useNavigation();
    const [selectedMentor, setSelectedMentor] = useState('');
    const [userData, setUserData] = useState({});
    const [name, setName] = useState('');
    const [rollNo, setRollNo] = useState('');
    const [reason, setReason] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [timeLeft, setTimeLeft] = useState(40 * 60);
    const [timerRunning, setTimerRunning] = useState(false);
    const [timerExpired, setTimerExpired] = useState(false);
    const [status, setStatus] = useState(''); 
    const [loading, setLoading] = useState(false); 
    const qrCodeRef = useRef(null);
    const [refreshing, setRefreshing] = useState(false);
    const [presentId,setPresentId]=useState('');
    const [invalid,setInvalid]=useState(true);
  
    const user = auth.currentUser;
    const storage = getStorage();

    const GetUserData = async () => {
      if (user) {
        const q = query(collection(db, 'MyInfo'), where('email', '==', user?.email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          setUserData({ id: doc.id, ...data });
          setName(data.Name || '');
          setRollNo(data.no || '');
          setSelectedMentor(data.mentor || '');
          if (data?.gatepassrequests === 'Pending') {
            setStatus('Pending');
            fetchRequestStatus();
          } else if (data?.gatepassrequests === 'Approved') {
            setStatus('Approved');
            fetchRequestStatus();
          } else if (data?.gatepassrequests === 'Declined') {
            setStatus('Declined');
          } else {
            setStatus('');
          }
        });
      } else {
        Alert.alert('Error', 'Please Re-Login.');
      }
    };
    
  
    useEffect(() => {
      navigation.setOptions({
        headerShown: false,
      });
    }, []);
  
    useEffect(() => {
        let interval;
        
        if (timerRunning && timeLeft > 0) {
          interval = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
          }, 1000);
        }
        if (timeLeft === 0 && timerRunning) {
          clearInterval(interval);
          setTimerRunning(false);
          setTimerExpired(true);
      
          const userRef = doc(db, 'MyInfo', userData.id);
          updateDoc(userRef, { gatepassrequests: '' });
      
          const gatePassRef = doc(db, 'GatePassRequests', presentId);
          updateDoc(gatePassRef, { status: 'invalid' });
        }
      
        return () => clearInterval(interval); 
      }, [timerRunning, timeLeft]);
      
  
    const startTimer = () => {
      setTimerRunning(true);
    };


  
    useEffect(() => {
      if (user) {
        GetUserData();
      }
    }, [user]);

  
    const mentors = [
      'Swathi Tejah',
      'Shoba Rani',
      'Kiranmai',
      'Kaneez',
      'Ramana Kadiyala',
      'Vasanth Sena',
      'Anjum',
    ];
  
    const handleSubmit = async () => {
      const qrData = `Name: ${name}\nRoll No: ${rollNo}\nMentor: ${selectedMentor}\nReason: ${reason}`;
      try {
        const docRef = await addDoc(collection(db, 'GatePassRequests'), {
          name,
          rollNo,
          reason,
          mentor: selectedMentor,
          mentorEmail: 'swathi@gmail.com',
          status: 'Pending', 
          qrCodeUrl: '', 
          email: user.email,
          createdAt: new Date().getTime(),
        });
        setPresentId(docRef.id);
  
        setStatus('Pending'); 
  
        
        const userRef = doc(db, 'MyInfo', userData.id);
        await updateDoc(userRef, {
          gatepassrequests: 'Pending',
        });
  
        
        await addDoc(collection(db, 'notifications'), {
          title: 'Gate Pass Request',
          mentor: selectedMentor,
          message: `Gate pass request from ${name}`,
          requestId: docRef.id,
          status: 'Pending',
          email: 'swathi@gmail.com',
          semail: user.email,
        });
  
        Alert.alert('Success', 'Gate pass request submitted successfully.');
      } catch (error) {
        console.error('Error submitting request:', error);
        Alert.alert('Error', 'Failed to submit request.');
      }
    };
  
    // const fetchRequestStatus = async () => {
    //   setRefreshing(true); // Start refreshing
    //   const q = query(collection(db, 'GatePassRequests'), where('rollNo', '==', rollNo));
    //   const querySnapshot = await getDocs(q);
  
    //   querySnapshot.forEach((doc) => {
    //     const data = doc.data();
    //     if (data.status === 'Approved') {
    //       if (!data.qrCodeUrl) {
    //         generateQRCode(doc.id, data); 
    //       } else {
    //         setQrCodeUrl(data.qrCodeUrl);
    //         setStatus('Approved');
    //         startTimer();
    //       }
    //     } else {
    //       setQrCodeUrl('');
    //       setStatus(data.status); 
    //       setTimerExpired(false);
    //     }
    //   });
  
    //   setRefreshing(false); // Stop refreshing
    // };
    const fetchRequestStatus = async () => {
      try {
        setRefreshing(true); 
        const q = query(collection(db, 'GatePassRequests'), where('rollNo', '==', rollNo));
        const querySnapshot = await getDocs(q);
        let invalid = true;
        
        querySnapshot.forEach(async (docSnapshot) => {
          const data = docSnapshot.data();
          const currentTime = new Date().getTime();
          const createdAt = data.createdAt;
    
          const timeDifference = (currentTime - createdAt) / (1000 * 60);
    
          if (timeDifference >= 40) {
            const requestRef = doc(db, 'GatePassRequests', docSnapshot.id);
            await updateDoc(requestRef, { status: 'Invalid' });
          } else {
            invalid = false;
            const remainingTime = 40 * 60 - (currentTime - createdAt) / 1000;
            setTimeLeft(remainingTime);
    
            if (data.status === 'Approved') {
              if (!data.qrCodeUrl) {
                generateQRCode(docSnapshot.id, data);
              } else {
                setQrCodeUrl(data.qrCodeUrl);
                setStatus('Approved');
                startTimer();
              }
            } else {
              setQrCodeUrl('');
              setStatus(data.status);
              setTimerExpired(false);
            }
          }
        });
    
        if (invalid) {
          const userRef = doc(db, 'MyInfo', userData.id);
          await updateDoc(userRef, { gatepassrequests: '' });
          setStatus('Invalid');
          setTimerExpired(true);
        }
      } catch (error) {
        console.error("Error fetching request status:", error);
        // Alert.alert("Error", "Failed to fetch status.");
      } finally {
        setRefreshing(false); 
      }
    };
    
    
    
  
    const generateQRCode = async (requestId, data) => {
      try {
        const qrData = `Name: ${data.name}\nRoll No: ${data.rollNo}\nMentor: ${data.mentor}\nReason: ${data.reason}`;
        const qrRef = ref(storage, `qr_codes/${data.name}_${data.rollNo}.png`);
        const qrCodeUri = await captureRef(qrCodeRef.current, { format: 'png', quality: 0.8 });
        const response = await fetch(qrCodeUri);
        const blob = await response.blob();
        await uploadBytes(qrRef, blob);
        const downloadURL = await getDownloadURL(qrRef);
        await updateDoc(doc(db, 'GatePassRequests', requestId), { qrCodeUrl: downloadURL });
  
        setQrCodeUrl(downloadURL); 
        setStatus('Approved');
        startTimer();
        Alert.alert('Success', 'QR Code generated successfully.');
      } catch (error) {
        console.error('Error generating QR Code:', error);
        Alert.alert('Error', 'Failed to generate QR Code.');
      }
    };
  
    return (
      <View style={{ height: '100%', backgroundColor: Colors.lightblack, padding: 20 }}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.lightblack} translucent={false} />
        <Text
          style={{
            color: Colors.white,
            fontSize: 30,
            fontWeight: 'bold',
            marginTop: 50,
            textAlign: 'center',
          }}
        >
          GatePass
        </Text>
        <View style={{ flex: 1 }}>
          {status === 'Pending' ? (
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={fetchRequestStatus} 
                  colors={[Colors.white]} 
                  tintColor={Colors.white}
                />
              }
            >
              <View>
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: 'bold',
                    marginTop: 30,
                    textAlign: 'center',
                  }}
                >
                  Your request has been submitted to your mentor.
                </Text>
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: 'bold',
                    marginTop: 30,
                    textAlign: 'center',
                  }}
                >
                  Status: {status}
                </Text>
              </View>
            </ScrollView>
          ) : status === 'Approved' && !timerExpired ? (
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={fetchRequestStatus} 
                  colors={[Colors.white]} 
                  tintColor={Colors.white} 
                />
              }
            >
              <Text
                style={{
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginTop: 30,
                  textAlign: 'center',
                }}
              >Pull down to Refresh until the time starts running</Text>
              <View style={{ alignItems: 'center', marginTop: 30 ,padding:40,backgroundColor:Colors.white}}>
                {qrCodeUrl ? (
                  <Image source={{ uri: qrCodeUrl }} style={{ width: 300, height: 300 }} />
                ) : (
                  <QRCode
                    value={`Name: ${name}\nRoll No: ${rollNo}\nMentor: ${selectedMentor}\nReason: ${reason}`}
                    size={300}
                    getRef={qrCodeRef} 
                  />
                )}
              </View>
              <Text style={{ color: Colors.white, fontSize: 20, textAlign: 'center', marginTop: 20,
                fontWeight: '600'
               }}>
            Your request has been approved. Time left: {Math.floor(timeLeft / 60)} minutes {Math.floor(timeLeft % 60)} seconds.
          </Text>
          </ScrollView>
          ) : status === 'Declined' ? (
            <Text
              style={{
                color: Colors.white,
                fontSize: 20,
                fontWeight: 'bold',
                marginTop: 30,
                textAlign: 'center',
              }}
            >
              Your request has been declined.
            </Text>
          ) : (
            <ScrollView style={{ marginTop: 30 }}>
              <Text style={{ color: Colors.white, fontSize: 20, fontWeight: 'bold',textAlign:'center' }}>Fill the form to request a gate pass</Text>
              <View>
              <Text
                style={{
                  color: Colors.white,
                  fontSize: 20,
                  marginTop: 20,
                  fontWeight: 'bold',
                }}
              >
                Name
              </Text>
              <TextInput
                placeholder="Enter your name"
                placeholderTextColor={Colors.lightgray}
                value={name}
                onChangeText={setName}
                style={{
                  borderRadius: 5,
                  color: Colors.white,
                  padding: 20,
                  paddingBottom: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.lightGray,
                  fontSize: 20,

                }}
              />
              </View>
              <View>
              <Text
                style={{
                  color: Colors.white,
                  fontSize: 20,
                  marginTop: 20,
                  fontWeight: 'bold',
                }}
              >
                Roll No
              </Text>
              <TextInput
                placeholder="Enter your roll number"
                placeholderTextColor={Colors.lightGray}
                value={rollNo}
                onChangeText={setRollNo}
                style={{
                  borderRadius: 5,
                  color: Colors.white,
                  padding: 20,
                  paddingBottom: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.lightGray,
                  fontSize: 20,
                }}
              />
              </View>
              <View>
              <Text
                style={{
                  color: Colors.white,
                  fontSize: 20,
                  marginTop: 20,
                  fontWeight: 'bold',
                }}
              >
                Reason
              </Text>

              <TextInput
                placeholder="Enter reason for gate pass"
                placeholderTextColor={Colors.lightGray}
                multiline={true}
                value={reason}
                onChangeText={setReason}
                style={{
                  borderRadius: 5,
                  color: Colors.white,
                  padding: 20,
                  paddingBottom: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.lightGray,
                  fontSize: 20,
                }}
              />
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 20 }}>
                    {mentors.map((mentor) => (
                        <TouchableOpacity
                            key={mentor}
                            onPress={() => setSelectedMentor(mentor)}
                            style={{
                                backgroundColor: selectedMentor === mentor ? '#E8FF59' : '#2C2C2E',
                                borderRadius: 20,
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                marginRight: 10,
                                marginBottom: 10,
                            }}
                        >
                            <Text style={{ color: selectedMentor === mentor ? 'black' : 'white', fontWeight: 'bold' }}>
                                {mentor}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
              <TouchableOpacity
                onPress={handleSubmit}
                style={{
                  backgroundColor: Colors.white,
                  padding: 20,
                  borderRadius: 99,
                  marginTop: 20,
                }}
              >
                <Text style={{ color: Colors.black, textAlign: 'center', fontWeight: 'bold',
                fontSize:20 }}>
                 
                  Submit Request
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </View>
    );
  }