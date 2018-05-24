import React from 'react';
import { StyleSheet, Text, View, Dimensions, SafeAreaView } from 'react-native';
import { Gyroscope, DeviceMotion, DangerZone } from 'expo';

export class Dot extends React.Component {
  componentWillMount(){
  }
  render(){
    return(
      <View style={[styles.dot, {
        top: this.props.positionY,
        left: this.props.positionX,
        backgroundColor: this.props.color
      }]}></View>
    )
  }
}

export default class App extends React.Component {
  state = {
    dataRotation: {},
    dataAcceleration: {},
  }
  dotsArray = [{positionX: 0 , positionY: 0}];
  componentWillMount(){
    var lastPositionX = 0;
    var lastPositionY = 0;
    DangerZone.DeviceMotion.addListener((dataDeviceMotion)=>{
      var newPositionX = dataDeviceMotion.rotation.gamma*Dimensions.get('window').width;
      var newPositionY = dataDeviceMotion.rotation.beta*Dimensions.get('window').height;
      if(Math.abs(newPositionX - lastPositionX) > 12 || Math.abs(newPositionY - lastPositionY) > 12 ){
        if (this.dotsArray.length > 10) {
          this.dotsArray.splice(0,5);
        }
        this.setState({dataRotation: dataDeviceMotion.rotation});
        this.dotsArray.push({positionX: newPositionX, positionY: newPositionY})
        lastPositionX = newPositionX;
        lastPositionY = newPositionY;
      }
    })
  }
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#292929'}}>
        <View style={[styles.container, {borderWidth: 8, borderRadius: 16, borderColor: '#292929', backgroundColor: 'black'}]}>
      {this.dotsArray.map((l,i)=>{
        if(i >= this.dotsArray.length-1){
          return(
            <Dot
            positionX={Math.round(l.positionX)}
            positionY={Math.round(l.positionY)}
            color='yellow'
            ></Dot>
          )
        } else {
          return(
            <Dot
            positionX={Math.round(l.positionX)}
            positionY={Math.round(l.positionY)}
            color='grey'
            ></Dot>
          )
        }
      })}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 24,
    height: 24,
    backgroundColor: 'white',
    position: 'absolute',
  }
});
