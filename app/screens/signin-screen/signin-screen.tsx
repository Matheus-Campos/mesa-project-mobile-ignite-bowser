import React, { FunctionComponent as Component, useState } from "react"
import { View, Image, ViewStyle, TextStyle, ImageStyle, ActivityIndicator } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { Button, Header, Screen, Text, Wallpaper, TextField } from "../../components"
import { color, spacing } from "../../theme"
import { useStores } from "../../models"
const bowserLogo = require("./bowser.png")

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
}
const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: "Montserrat",
}
const BOLD: TextStyle = { fontWeight: "bold" }
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[4] + spacing[1],
  paddingHorizontal: 0,
}
const HEADER_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}
const TITLE_WRAPPER: TextStyle = {
  ...TEXT,
  textAlign: "center",
}
const TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
}

const BOWSER: ImageStyle = {
  alignSelf: "center",
  marginVertical: spacing[5],
  maxWidth: "100%",
}

const TEXT_FIELD: TextStyle = {
  color: color.primaryDarker,
  borderRadius: 4,
  paddingHorizontal: spacing[4]
}

const CONTINUE: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  backgroundColor: color.button,
}
const CONTINUE_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
}

export const SignInScreen: Component = observer(function SignInScreen() {
  const navigation = useNavigation()

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const rootStore = useStores()

  const signIn = async () => {
    await rootStore.signIn(email, password)
    navigation.navigate("main")
  }

  return (
    <View style={FULL}>
      <Wallpaper />
      <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
        <Header headerTx="welcomeScreen.poweredBy" style={HEADER} titleStyle={HEADER_TITLE} />
        <Text style={TITLE_WRAPPER}>
          <Text style={TITLE} text="Locais do Mundo" />
        </Text>
        <Image source={bowserLogo} style={BOWSER} />
        <TextField
          inputStyle={TEXT_FIELD}
          label="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
        />
        <TextField
          inputStyle={TEXT_FIELD}
          label="Digite sua senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button
          style={CONTINUE}
          onPress={signIn}
        >
          {rootStore.loading
            ? <ActivityIndicator />
            : <Text style={CONTINUE_TEXT} tx="welcomeScreen.continue" />}
        </Button>
      </Screen>
    </View>
  )
})
