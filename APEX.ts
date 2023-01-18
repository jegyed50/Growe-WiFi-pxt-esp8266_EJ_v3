/*******************************************************************************
 * Functions for APEX_LOCAL
 *
 * Company: jegyed50
 * Website: http://www.cytron.io
 * Email:   jegyed50@gmail.com
 *******************************************************************************/

// APEX API url, port, path
const APEX_LOCAL_API_SERVER_NAME_IP = "192.168.0.2"
const APEX_LOCAL_API_SERVER_PORT = "8080"
const APEX_LOCAL_API_TEST_PATH="/ords/f?p=100:6::APPLICATION_PROCESS=LOG_DATA_01:::P6_FIELD1:-99.9"
const APEX_LOCAL_API_PATH_WITHOUT_PARAMETERS="/ords/f?p=100:6::APPLICATION_PROCESS=LOG_DATA_01:::"
const APEX_LOCAL_API_PARAMETER_PREFIX="P6_FIELD"
namespace APEX_esp8266 {
    // Flag to indicate whether the data was uploaded to APEX successfully.
    let APEX_LOCAL_Uploaded = false
    let APEX_LOCAL_Connected = false

/**
     * Return true if connection to APEX_LOCAL server successfully.
     */
    //% subcategory="APEX local"
    //% weight=33
    //% blockGap=8
    //% blockId=esp8266_is_APEX_local_server_connected
    //% block="APEX_LOCAL server connected"
    export function isAPEX_LOCAL_Connected(): boolean {
        return APEX_LOCAL_Connected
    }


    /**
     * Return true if data is uploaded to APEX_LOCAL successfully.
     */
    //% subcategory="APEX local"
    //% weight=32
    //% blockGap=8
    //% blockId=esp8266_is_APEX_data_uploaded
    //% block="APEX_LOCAL data uploaded"
    export function isAPEX_LOCAL_Uploaded(): boolean {
        return APEX_LOCAL_Uploaded
    }

  /** 
     *connection to APEX_LOCAL server
     * @param APEX_SERVER_NAME_IP.
     * @param APEX_SERVER_PORT.
     */
    //% subcategory="APEX local"
    //% weight=30
    //% blockGap=8
    //% blockId=esp8266_connect_APEX_LOCAL
    //% block="Connect to APEX_LOCAL_API_SERVER2 |SERVER_NAME_IP %APEX_SERVER_NAME_IP |APEX_SERVER_PORT %APEX_SERVER_PORT"
    export function connectAPEXLocal(APEX_SERVER_NAME_IP: string = APEX_LOCAL_API_SERVER_NAME_IP,
				APEX_SERVER_PORT : string = APEX_LOCAL_API_SERVER_PORT ) {

        // Reset the upload successful flag.
        APEX_LOCAL_Connected = false

        // Make sure the WiFi is connected.
        if (isWifiConnected() == false) return

        // Connect to APEX_LOCAL. Return if failed.
		//
       // if (sendCommand("AT+CIPSTART=\"TCP\",\"" + APEX_SERVER_NAME_IP + "\",8080", null, 10000) == false) return // 8080-at cserélni APEX_SERVER_PORT-ra !!!
        APEX_LOCAL_Connected =  sendCommand("AT+CIPSTART=\"TCP\",\"192.168.0.2\",8080", "OK", 10000)
	 
	// APEX_LOCAL_Connected =  sendCommand("AT+CIPSTART=\"TCP\",\"thingspeak.com\",80", "OK", 10000)
  
    }

    /**
     * Upload data to APEX (Data can only be updated to APEX every 15 seconds ? 
     Kiszámolni, hogy a havi net forgalmi korlátba mi fée bele az APEX AlleaysFree szolgáltatásba.) !!!
     * @param APEX_SERVER_NAME_IP.
	 * @param APEX_SERVER_PORT.
     * @param WITHOUT_PARAMETERS.
     * @param PARAMETER_PREFIX
     * @param field1 Data for Field 1.
     * @param field2 Data for Field 2.
     * @param field3 Data for Field 3.
     * @param field4 Data for Field 4.
     * @param field5 Data for Field 5.
     * @param field6 Data for Field 6.
     * @param field7 Data for Field 7.
     * @param field8 Data for Field 8.
     */
    //% subcategory="APEX local"
    //% weight=29
    //% blockGap=8
    //% blockId=esp8266_upload_APEX_LOCAL
    //% block="Upload data to APEX_LOCAL_API_SERVER_NAME_IP |SERVER_NAME_IP %APEX_SERVER_NAME_IP |APEX_SERVER_PORT %APEX_SERVER_PORT |WITHOUT_PARAMETERS %WITHOUT_PARAMETERS |PARAMETER_PREFIX %PARAMETER_PREFIX|Field 1 %field1||Field 2 %field2|Field 3 %field3|Field 4 %field4|Field 5 %field5|Field 6 %field6|Field 7 %field7|Field 8 %field8"
    export function uploadAPEXLocal(   APEX_SERVER_NAME_IP: string = APEX_LOCAL_API_SERVER_NAME_IP,
										APEX_SERVER_PORT : string = APEX_LOCAL_API_SERVER_PORT,
										WITHOUT_PARAMETERS : string = APEX_LOCAL_API_TEST_PATH,
										PARAMETER_PREFIX : string = APEX_LOCAL_API_PATH_WITHOUT_PARAMETERS,
                                        field1: number,
                                        field2: number = null,
                                        field3: number = null,
                                        field4: number = null,
                                        field5: number = null,
                                        field6: number = null,
                                        field7: number = null,
                                        field8: number = null  ) {

        // Reset the upload successful flag.
        APEX_LOCAL_Uploaded = false

        // Make sure the WiFi is connected.
        if (isWifiConnected() == false) return

        // Connect to APEX_LOCAL. Return if failed.
		//
       // if (sendCommand("AT+CIPSTART=\"TCP\",\"" + APEX_SERVER_NAME_IP + "\",8080", null, 10000) == false) return // 8080-at cserélni APEX_SERVER_PORT-ra !!!
        APEX_LOCAL_Connected =  sendCommand("AT+CIPSTART=\"TCP\",\"" + "192.168.0.2" + "\",8080", "OK", 10000)
                                                                   // 8080-at cserélni APEX_SERVER_PORT-ra !!!
        // Construct the data to send.
	    // http://192.168.0.2:8080/ords/f?p=100:6::APPLICATION_PROCESS=LOG_DATA_01:::P6_FIELD1:-99.9
        let data = "GET /ords/f?p=100:6::APPLICATION_PROCESS=LOG_DATA_01:::P6_FIELD1:-99.9" 
        /*
		if (field2 != null) data += "&field2=" + field2
        if (field2 != null) data += "&field3=" + field3
        if (field2 != null) data += "&field4=" + field4
        if (field2 != null) data += "&field5=" + field5
        if (field2 != null) data += "&field6=" + field6
        if (field2 != null) data += "&field7=" + field7
        if (field2 != null) data += "&field8=" + field8
		*/

        // Send the data.
        sendCommand("AT+CIPSEND=" + (data.length + 2))
        sendCommand(data)
        
        // Return if "SEND OK" is not received.
        //if (getResponse("SEND OK", 1000) == "") return
        
        // Check the response from ThingSpeak.
       // let response = getResponse("+IPD", 1000)
       // if (response == "") return

        // Trim the response to get the upload count.
       // response = response.slice(response.indexOf(":") + 1, response.indexOf("CLOSED"))
      //  let uploadCount = parseInt(response)

        // Return if upload count is 0.
        //if (uploadCount == 0) return

        // Set the upload successful flag and return.
        APEX_LOCAL_Uploaded = true
        return
    }
}
