
import { Web5 } from '@web5/api';

import { webcrypto } from 'node:crypto';

// @ts-ignore
if (!globalThis.crypto) globalThis.crypto = webcrypto;

let setWeb5;
let setMyDid;
const { web5, did: hackHeroesDid } = await Web5.connect();

setWeb5(web5);
setMyDid(hackHeroesDid);

const queryLocalProtocol = async (web5) => {
  // console.log('this is in query local protocol')
  return await web5.dwn.protocols.query({
    message: {
      filter: {
        protocol: "https://blackgirlbytes.dev/burn-book-finale",
      },
    },
  })
};

//dummy variables to manage state
const medicalReportType = "file";


const queryRemoteProtocol = async (web5, hackHeroesDid) => {
  // console.log('this is where Query remote protocol is')
  return await web5.dwn.protocols.query({
    from: hackHeroesDid,
    message: {
      filter: {
        protocol: "https://blackgirlbytes.dev/burn-book-finale",
      },
    },
  })
};

const installLocalProtocol = async (web5, protocolDefinition) => {
// console.log('this is where we install local protocol')
return await web5.dwn.protocols.configure({
  message: {
    definition: protocolDefinition,
  }
});
};

const installRemoteProtocol = async (web5, hackHeroesDid, protocolDefinition) => {
// console.log('this is where we install remote protocol')
const { protocol } = await web5.dwn.protocols.configure({
  message: {
    definition: protocolDefinition,
  },
});
return await protocol.send(hackHeroesDid);
};


const defineNewProtocol = () => {
  // console.log('this is where we define our protocol')
  return {
    protocol: "https://blackgirlbytes.dev/burn-book-finale",
    published: true,
    types: {
      medicalReport: {
        schema: "https://example.com/secretMessageSchema",
        dataFormats: ["image/png"],
      },
    },
    structure: {
      medicalReport: {
        $actions: [
          { who: "anyone", can: "write" },
          { who: "author", of: "medicalReport", can: "read" },
        ],
      },
    },
  };
};


const configureProtocol = async (web5, hackHeroesDid) => {
  //  console.log('this is where we configure our protocol')
  const protocolDefinition = defineNewProtocol();
  const protocolUrl = protocolDefinition.protocol;

  const { protocols: localProtocols, status: localProtocolStatus } = await queryLocalProtocol(web5, protocolUrl);
  if (localProtocolStatus.code !== 200 || localProtocols.length === 0) {
    const result = await installLocalProtocol(web5, protocolDefinition);
    console.log({ result })
    console.log("Protocol installed locally");
  }

  const { protocols: remoteProtocols, status: remoteProtocolStatus } = await queryRemoteProtocol(web5, hackHeroesDid, protocolUrl);
  if (remoteProtocolStatus.code !== 200 || remoteProtocols.length === 0) {
    const result = await installRemoteProtocol(web5, hackHeroesDid, protocolDefinition);
    console.log({ result })
    console.log("Protocol installed remotely");
  }
  };

  const uploadToDwnReport = async (messageObj) => {
    //  console.log('this is where we Write the secret message')
    try {
      const medicalReportProtocol = defineNewProtocol();
      // Create a blob record

        const blob = new Blob(filename, { type: "image/png" });
        const { record, status } = await web5.dwn.records.create({
            data: blob,
            message: {
                dataFormat: "image/png",
                protocol: medicalReportProtocol.protocol,
                protocolPath: "medicalReport",
                schema: medicalReportProtocol.types.medicalReport.schema,
                recipient: hackHeroesDid,
            }
        });
        
      
      // const { record, status } = await web5.dwn.records.write({
      //   data: messageObj,
      //   message: {
      //     protocol: medicalReportProtocol.protocol,
      //     protocolPath: "medicalReport",
      //     schema: medicalReportProtocol.types.medicalReport.schema,
      //     recipient: myDid,
      //   },
      // });
  
      if (status === 200) {
        return { ...messageObj, recordId: record.id };
      }
  
      console.log('Secret message written to DWN', { record, status });
      return record;
    } catch (error) {
      console.error('Error writing secret message to DWN', error);
    }
    };


    const handleSubmit = async (event) => {
      event.preventDefault();
      console.log('Submitting message...');
      setSubmitStatus('Submitting...');
  
      try {
        const targetDid = medicalReportType === 'file' ? recipientDid : myDid;
        let messageObj;
        let record;
        
        //currently we have a single object medicalReport so we dont need an if statement
  
        
          messageObj = constructMedicalReport(); 
          record = await uploadToDwnReport(messageObj);
        
  
        if (record) {
          const { status } = await record.send(targetDid);
          console.log("Send record status in handleSubmit", status);
          setSubmitStatus('Message submitted successfully');
          await fetchMessages();
        } else {
          throw new Error('Failed to create record');
        }
  
        setMessage('');
        setImageUrl('');
      } catch (error) {
        console.error('Error in handleSubmit', error);
        setSubmitStatus('Error submitting message: ' + error.message);
      }
    };

    const constructSecretMessage = () => {
      const currentDate = new Date().toLocaleDateString();
      const currentTime = new Date().toLocaleTimeString();
  
      return {
        text: message, 
        timestamp: `${currentDate} ${currentTime}`,
        sender: myDid, 
        type: 'Secret',
        imageUrl: imageUrl, 
      };
    };


    const constructMedicalReport = () => {
      const currentDate = new Date().toLocaleDateString();
      const currentTime = new Date().toLocaleTimeString();
  
      return {
        text: message, 
        timestamp: `${currentDate} ${currentTime}`,
        sender: myDid, 
        type: 'Secret',
        imageUrl: imageUrl, 
      };
    };

    const fetchMedicalReport = async () => {
      console.log('Fetching sent messages...');
      try {
        const response = await web5.dwn.records.query({
          from: myDid,
          message: {
            filter: {
              protocol: "https://blackgirlbytes.dev/burn-book-finale",
              schema: "https://example.com/directMessageSchema",
            },
          },
        });
  
        if (response.status.code === 200) {
          const userMessages = await Promise.all(
            response.records.map(async (record) => {
              const data = await record.data.json();
              return {
                ...data, 
                recordId: record.id 
              };
            })
          );
          return userMessages
        } else {
          console.error('Error fetching sent messages:', response.status);
          return [];
        }
  
      } catch (error) {
        console.error('Error in fetchSentMessages:', error);
      }
    };

    const fetchMessages = async () => {
      const userMessages = await fetchMedicalReport();
      const allMessages = [...(userMessages || [])];
      setMessages(allMessages);
    };
