/*Eduardo Villalpando Mello, May 26th, 2018*/

var AppVersionNumber = 'v. 0.9.2';

import React from 'react';
import { StyleSheet, Text, View, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import { Gyroscope, DeviceMotion, DangerZone } from 'expo';


//Global variables and settings for the game (to be expanded in future updates)
var Game_this;
var lastPositionX;
var lastPositionY;


//ElementsDot for rendering food, traps, portals and the snake itself
export class ElementsDot extends React.Component {
  render(){
    //onTouch functionality (except for active)
    if(this.props.dotType != 'active' && this.props.dotType != 'tail' && this.props.positionX == lastPositionX && this.props.positionY == lastPositionY){
      //conditionals ----
      GameBoard.snakeLength = GameBoard.snakeLength +1;
      GameBoard.generateItems();
    }
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

//Game container: GameBoard and GameLoose (GameLevels also, maybe)
export default class Game extends React.Component{
  componentWillMount(){
    Game_this = this;
  }
  static gameShow = 'GameBoard';
  static gameShowChange(gameShowNew){
    Game.gameShow = gameShowNew;
    DangerZone.DeviceMotion.removeAllListeners();
    Game_this.forceUpdate();
  }
  render(){
    switch (Game.gameShow) {
      case 'GameBoard':
        return <GameBoard></GameBoard>;
        break;
      case 'GameLoose':
        return <GameLoose></GameLoose>;
        break;
      default:
    }
  }
}

export class GameLoose extends React.Component {
  render(){
    return(
      <SafeAreaView style={[styles.container, {backgroundColor: 'black'}]}>
        <Text style={{fontSize: 48, color: 'white', fontWeight: '800', letterSpacing: 2}}>YOU LOOSE</Text>
        <Text style={{fontSize: 48, color: 'white', fontWeight: '800', letterSpacing: 2}}>{GameBoard.snakeLength}</Text>
        <TouchableOpacity style={{height: 48, backgroundColor: 'white', borderRadius: 16, margin: 24, flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center'}} onPress={()=>{Game.gameShowChange('GameBoard')}}>
          <Text style={{fontSize: 16}}>PLAY AGAIN</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )

  }
}

export class GameBoard extends React.Component {
  state = {
    dataRotation: {},
    dataAcceleration: {},
  }
  //Get measurements in terms of 24 (blocks measure 24)
  widthGameBoard = 24*Math.floor(Dimensions.get('window').width/24);
  heightGameBoard = 24*Math.floor(Dimensions.get('window').height/24);

  //snake length is the punctuation
  static snakeLength = 5;
  //Array containing all the positions of the snake
  dotsArray = [{positionX: this.widthGameBoard/2 - 12 , positionY: this.heightGameBoard/2 - 12 }];

  //Array containing items to be rendered on the map
  static itemsArray = []

  //Generate items at random positions on the map
  static generateItems(){
    var widthGameBoard = 24*Math.floor(Dimensions.get('window').width/24);
    var heightGameBoard = 24*Math.floor(Dimensions.get('window').height/24);
    GameBoard.itemsArray = [
      {positionX: 24*Math.floor(Math.random() * ((widthGameBoard-48)/24 +1)), positionY: 24*Math.floor(Math.random() * ((heightGameBoard-48)/24 +1)), dotType: 'food' }
    ]
  }
  componentWillMount(){
    GameBoard.generateItems();
    GameBoard.snakeLength = 2;
    lastPositionX = this.widthGameBoard/2 - 12;
    lastPositionY = this.heightGameBoard/2 - 12;
    this.dotsArray = [{ positionX: this.widthGameBoard/2 - 12 , positionY: this.heightGameBoard/2 - 12 }];
    DangerZone.DeviceMotion.addListener((dataDeviceMotion)=>{
      var newPositionX = lastPositionX;
      var newPositionY = lastPositionY;
      var shouldMoveX = true;
      var shouldMoveY = true;
      if(Math.round(dataDeviceMotion.rotation.beta ) > 0){
        newPositionY = lastPositionY + 24;
      } else if (Math.round(dataDeviceMotion.rotation.beta ) < 0) {
        newPositionY = lastPositionY - 24;
      } else {
        newPositionY = lastPositionY;
        shouldMoveY = false;
      }
      if (Math.round(dataDeviceMotion.rotation.gamma ) > 0) {
        newPositionX = lastPositionX + 24;
      } else if (Math.round(dataDeviceMotion.rotation.gamma ) < 0) {
        newPositionX = lastPositionX - 24;
      } else {
        newPositionX = lastPositionX;
        shouldMoveX = false;
      }
      var isTouching = this.dotsArray.find((obj)=>{ return obj.positionX == newPositionX && obj.positionY == newPositionY });
      var isOutOfBoundryX = (newPositionX + 12)/this.widthGameBoard < 0 || (newPositionX + 12)/this.widthGameBoard > 1 ;
      var isOutOfBoundryY = (newPositionY + 12)/this.heightGameBoard < 0 || (newPositionY + 12)/this.heightGameBoard > 1 ;
      if((shouldMoveX || shouldMoveY)){
        if(isTouching != undefined  || isOutOfBoundryX || isOutOfBoundryY){
          Game.gameShowChange('GameLoose');
        } else {
          if (this.dotsArray.length > GameBoard.snakeLength) {
            this.dotsArray.splice(0,1);
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
      <SafeAreaView style={{flex: 1, backgroundColor: '#292929', alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{color: 'white', position: 'absolute', zIndex: 3, top: 120}}>Score {GameBoard.snakeLength}  </Text>
        <View style={[styles.container, {borderWidth: 0, borderRadius: 16, borderColor: '#292929', backgroundColor: 'black', width: this.widthGameBoard, height: this.heightGameBoard }]}>
          {this.dotsArray.map((l,i)=>{
            if(i >= this.dotsArray.length-1){
              return(
                <ElementsDot
                positionX={l.positionX}
                positionY={l.positionY}
                color='white'
                dotType='active'
                ></ElementsDot>
              )
            } else {
              return(
                <ElementsDot
                positionX={l.positionX}
                positionY={l.positionY}
                color='grey'
                dotType='tail'
                ></ElementsDot>
              )
            }
          })}
          {GameBoard.itemsArray.map((l,i)=>{
            return(
              <ElementsDot
              positionX={l.positionX}
              positionY={l.positionY}
              color='blue'
              dotType={l.dotType}
              ></ElementsDot>
            )
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
