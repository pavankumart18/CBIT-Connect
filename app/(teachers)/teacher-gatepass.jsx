import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import { Colors } from '../../constants/Colors';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { auth, db } from '../../configs/FireBaseConfigs';
import { collection, getDocs, query, where, updateDoc, doc, serverTimestamp } from 'firebase/firestore';

export default function TeacherGatePass() {
  const navigation = useNavigation();
  const user = auth.currentUser;
  const [segregatedGatePasses, setSegregatedGatePasses] = useState({
    pending: [],
    approved: [],
    declined: [],
  });

  const GetGatePasses = async () => {
    if (!user) return;

    const q = query(collection(db, 'GatePassRequests'), where('mentorEmail', '==', user?.email));
    const querySnapshot = await getDocs(q);
    const gatepasses = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      gatepasses.push({ id: doc.id, ...data });
    });
    segregateGatePasses(gatepasses);
    // console.log('Gate Passes:', gatepasses);
  };

  const segregateGatePasses = (gatepasses) => {
    const pending = gatepasses.filter(gatepass => gatepass.status === 'Pending');
    const approved = gatepasses.filter(gatepass => gatepass.status === 'Approved');
    const declined = gatepasses.filter(gatepass => gatepass.status === 'Declined');
    setSegregatedGatePasses({ pending, approved, declined });
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    if (user) {
      console.log('Fetching Gate Passes...');
      GetGatePasses();
    }
  }, []);

  const handleGatePassUpdate = async (gatepass, newStatus) => {
    try {
      const notificationQuery = query(
        collection(db, 'notifications'),
        where('semail', '==', gatepass.email)
      );
      const notificationSnapshot = await getDocs(notificationQuery);
      notificationSnapshot.forEach(async (docSnapshot) => {
        const notificationRef = doc(db, 'notifications', docSnapshot.id);
        await updateDoc(notificationRef, { status: newStatus });
      });

      const myInfoQuery = query(
        collection(db, 'MyInfo'),
        where('email', '==', gatepass.email)
      );
      const myInfoSnapshot = await getDocs(myInfoQuery);
      myInfoSnapshot.forEach(async (docSnapshot) => {
        const myInfoRef = doc(db, 'MyInfo', docSnapshot.id);
        await updateDoc(myInfoRef, { gatepassrequests: newStatus });
      });

      const gatePassRef = doc(db, 'GatePassRequests', gatepass.id);
      await updateDoc(gatePassRef, { status: newStatus, timestamp: serverTimestamp() });

      GetGatePasses();

      // console.log(`Gate pass updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating gate pass:', error);
    }
  };

  const renderGatePass = (gatepass, isPending = true) => (
    <View
      key={gatepass.id}
      style={{
        backgroundColor: Colors.white,
        padding: 15,
        borderRadius: 10,
        marginVertical: 5,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
        gap: 10,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black', textAlign: 'center' }}>
        Request from {gatepass.name}
      </Text>
      <Text style={{ fontSize: 16, color: 'black' }}>{gatepass.rollNo}</Text>
      <Text style={{ fontSize: 16, color: 'black' }}>{gatepass.mentor}</Text>
      <Text style={{ fontSize: 16, color: 'black' }}>{gatepass.reason}</Text>

      {isPending ? (
        <>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.black,
              padding: 10,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => handleGatePassUpdate(gatepass, 'Approved')}
          >
            <Text style={{ color: Colors.white, fontSize: 16, fontWeight: 'bold' }}>Approve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: Colors.black,
              padding: 10,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => handleGatePassUpdate(gatepass, 'Declined')}
          >
            <Text style={{ color: Colors.white, fontSize: 16, fontWeight: 'bold' }}>Decline</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={{ fontSize: 16, color: 'black',fontWeight:'bold' }}>
          {`Status: ${gatepass.status} `}
          {gatepass.timestamp && `on ${new Date(gatepass.timestamp.seconds * 1000).toLocaleString()}`}
        </Text>
      )}
    </View>
  );

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 60,
        padding: 20,
        backgroundColor: Colors.lightblack,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
        }}
      >
        <FontAwesome6 name="torii-gate" size={24} color="white" />
        <Text style={{ color: Colors.white, fontSize: 24, fontWeight: 'bold' }}>Gate Pass Requests</Text>
      </View>

      {/* Pending Gate Passes */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ color: Colors.white, fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
          Pending Gate Passes
        </Text>
        {segregatedGatePasses.pending.length > 0 ? (
          segregatedGatePasses.pending.map((gatepass) => renderGatePass(gatepass, true))
        ) : (
          <Text style={{ color: Colors.white, fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
            No Pending Gate Passes
          </Text>
        )}
      </View>

      {/* Approved Gate Passes */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ color: Colors.white, fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
          Approved Gate Passes
        </Text>
        {segregatedGatePasses.approved.length > 0 ? (
          segregatedGatePasses.approved.map((gatepass) => renderGatePass(gatepass, false))
        ) : (
          <Text style={{ color: Colors.white, fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
            No Approved Gate Passes
          </Text>
        )}
      </View>

      {/* Declined Gate Passes */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ color: Colors.white, fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
          Declined Gate Passes
        </Text>
        {segregatedGatePasses.declined.length > 0 ? (
          segregatedGatePasses.declined.map((gatepass) => renderGatePass(gatepass, false))
        ) : (
          <Text style={{ color: Colors.white, fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
            No Declined Gate Passes
          </Text>
        )}
      </View>
    </View>
  );
}
