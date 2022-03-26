import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import Formulario from './components/Formulario'
import Clima from './components/Clima'

export default function App() {
  const [busqueda, guardarBusqueda]=useState({
    ciudad:'',
    pais:''
  });

  const [consultar, guardarConsultar]=useState(false);
  const [resultado, guardarResultado]=useState({});
  const [bgcolor, guardarBgcolor]=useState('rgb(71, 149, 212)');

  const {ciudad, pais}=busqueda
  useEffect(()=>{
    const consultarClima=async ()=>{
      if(consultar){
        const appId='fc8ff9f409f52b1cc6757e25a0ceac04'
        const url=`http://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;
        console.log(url);
        try {
          const respuesta= await fetch(url);
          const resultado= await respuesta.json();
          console.log(resultado)
          guardarResultado(resultado);
          guardarConsultar(false);
          //modifica los colores de fondo segun temperatura
          const kelvin=273.15;
          const {main}=resultado;
          const actual=main.temp-kelvin;
          if(actual<10){
            guardarBgcolor('rgb(105, 108, 149)');
          }else if(actual>=10 && actual<25){
            guardarBgcolor('rgb(71, 149, 212)');
          }else{
            guardarBgcolor('rgb(178, 28, 61)');
          }
        } catch (e) {
          mostrarAlerta();
        }
      }
    };
    consultarClima();
  }, [consultar]);

  const mostrarAlerta=()=>{
    Alert.alert(
      'Error',
      'No hay resultado, intenta con otra Ciudad o Pais',
      [{text:'Ok'}]
    )
  };

  const ocultarTeclado=()=>{
    Keyboard.dismiss()
  };

  const bgColorApp={
    backgroundColor:bgcolor
  }

  return (
    <>
    <TouchableWithoutFeedback onPress={()=>ocultarTeclado()}>
    <View style={[styles.app, bgColorApp]} >
      <View style={styles.contenido} >
        <Clima
          resultado={resultado}
        />
        <Formulario
        busqueda={busqueda}
        guardarBusqueda={guardarBusqueda}
        guardarConsultar={guardarConsultar}
        />
      </View>
    </View>
    </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    justifyContent:'center'
  },
  contenido:{
    marginHorizontal:'2.5%'
  }
});
