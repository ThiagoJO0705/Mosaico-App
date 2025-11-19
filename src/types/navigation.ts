export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;

  Interests: {
    form: {
      name: string;
      email: string;
      cpf: string;
      password: string;
    };
  };

  AppTabs: undefined;
};

export type AppTabsParamList = {
  Home: undefined;
  Tracks: undefined;
  AI: undefined;
  Profile: undefined;
};
