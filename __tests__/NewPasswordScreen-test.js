/**
 * Component regression test for the forgot-password reset screen.
 *
 * Replays the exact steps from the bug report: type the same valid
 * 8-character password into both fields and tap SEND. Before the fix the
 * screen toasted "Password Must of atlease 6 Characters" and never called
 * the API; after the fix it submits.
 * @format
 */

import 'react-native';
import React from 'react';
import renderer, {act} from 'react-test-renderer';
import Toast from 'react-native-simple-toast';
import axios from 'axios';

import NewPasswordScreen from '../Screens/Auth/NewPasswordScreen';
import {
  PASSWORD_EMPTY_MESSAGE,
  PASSWORD_TOO_SHORT_MESSAGE,
} from '../Screens/Auth/passwordValidation';

jest.mock('axios');

const flush = () => act(async () => {});

const renderScreen = () => {
  const navigation = {navigate: jest.fn()};
  const route = {params: {id: 'driver-1'}};
  let tree;
  act(() => {
    tree = renderer.create(
      <NewPasswordScreen navigation={navigation} route={route} />,
    );
  });
  return {tree: tree, navigation};
};

const type = (tree, label, text) => {
  act(() => {
    tree.root.findByProps({label: label}).props.action(text);
  });
};

const pressSend = tree => {
  act(() => {
    tree.root.findByProps({title: 'SEND'}).props.action();
  });
};

beforeEach(() => {
  jest.clearAllMocks();
});

it('submits when both fields contain the same valid password (bug report scenario)', async () => {
  axios.mockResolvedValue({data: {Status: true}});
  const {tree, navigation} = renderScreen();

  type(tree, 'New Password', 'Fticoach');
  type(tree, 'Confirm Password', 'Fticoach');
  pressSend(tree);
  await flush();

  expect(Toast.show).not.toHaveBeenCalledWith(PASSWORD_TOO_SHORT_MESSAGE);
  expect(axios).toHaveBeenCalledTimes(1);
  expect(navigation.navigate).toHaveBeenCalledWith('SignInScreen');
});

it('toasts and does not submit when the fields are empty', async () => {
  const {tree, navigation} = renderScreen();

  pressSend(tree);
  await flush();

  expect(Toast.show).toHaveBeenCalledWith(PASSWORD_EMPTY_MESSAGE);
  expect(axios).not.toHaveBeenCalled();
  expect(navigation.navigate).not.toHaveBeenCalled();
});

it('toasts and does not submit when the confirmation is too short', async () => {
  const {tree, navigation} = renderScreen();

  type(tree, 'New Password', 'Fticoach');
  type(tree, 'Confirm Password', 'Fti');
  pressSend(tree);
  await flush();

  expect(Toast.show).toHaveBeenCalledWith(PASSWORD_TOO_SHORT_MESSAGE);
  expect(axios).not.toHaveBeenCalled();
  expect(navigation.navigate).not.toHaveBeenCalled();
});
