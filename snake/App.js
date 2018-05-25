import React from 'react';
import { StyleSheet, Text, View, Dimensions, SafeAreaView } from 'react-native';
import { Gyroscope, DeviceMotion, DangerZone } from 'expo';

export class ElementsDot extends React.Component {
  componentWillMount(){
  }
  render(){
    return(
      <View style={[styles.dot, {
        top: this.props.positionY,
        left: this.props.positionX,
        backgroundColor: this.props.color
      }]}>
      </View>
    )
  }
}


export default class Game extends React.Component{

  static gameLoose(){
    Game.gameShow = 'loose';
    alert("Loose");
  }


  static gameShow = 'board';
  render(){
    if(Game.gameShow == 'board'){
      return <GameBoard></GameBoard>
    }
    else if (Game.gameShow == 'loose'){
      return <GameLoose></GameLoose>
    }
  }
}

export class GameLoose extends React.Component {
  render(){
    return <Text>YOU LOOSE</Text>
  }
}

export class GameBoard extends React.Component {
  state = {
    dataRotation: {},
    dataAcceleration: {},
  }
  dotsArray = [{positionX: Dimensions.get('window').width/2 - 12 , positionY: Dimensions.get('window').height/2 - 12}];

  componentWillMount(){
    var lastPositionX = Dimensions.get('window').width/2;
    var lastPositionY = Dimensions.get('window').height/2;
    DangerZone.DeviceMotion.addListener((dataDeviceMotion)=>{
      //alert("hi");
      var newPositionX = lastPositionX;
      var newPositionY = lastPositionY;
      var shouldMoveX = true;
      var shouldMoveY = true;
        if(Math.round(dataDeviceMotion.rotation.beta * 2) > 0){
          newPositionY = lastPositionY + 24;
        } else if (Math.round(dataDeviceMotion.rotation.beta * 2) < 0) {
          newPositionY = lastPositionY - 24;
        } else {
          newPositionY = lastPositionY;
          shouldMoveY = false;
        }
        if (Math.round(dataDeviceMotion.rotation.gamma * 2) > 0) {
          newPositionX = lastPositionX + 24;
        } else if (Math.round(dataDeviceMotion.rotation.gamma * 2) < 0) {
          newPositionX = lastPositionX - 24;
        } else {
          newPositionX = lastPositionX;
          shouldMoveX = false;
        }
        var isTouching = this.dotsArray.find((obj)=>{ return obj.positionX == newPositionX && obj.positionY == newPositionY });
        if((shouldMoveX || shouldMoveY)){
          if(isTouching != undefined){
            Game.gameLoose();
          } else {
            if (this.dotsArray.length > 10) {
              this.dotsArray.splice(0,5);
            }
            this.dotsArray.push({positionX: newPositionX, positionY: newPositionY})
            lastPositionX = newPositionX;
            lastPositionY = newPositionY;
          }


        }
        this.forceUpdate();
    })
  }
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#292929'}}>
        <Text style={{color: 'white'}}>v. 0.6.5</Text>

        <View style={[styles.container, {borderWidth: 8, borderRadius: 16, borderColor: '#292929', backgroundColor: 'black'}]}>
      {this.dotsArray.map((l,i)=>{
        if(i >= this.dotsArray.length-1){
          return(
            <ElementsDot
            positionX={Math.round(l.positionX)}
            positionY={Math.round(l.positionY)}
            color='blue'
            ></ElementsDot>
          )
        } else {
          return(
            <ElementsDot
            positionX={Math.round(l.positionX)}
            positionY={Math.round(l.positionY)}
            color='grey'
            ></ElementsDot>
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
