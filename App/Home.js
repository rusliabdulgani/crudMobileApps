import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
  BackHandler,
  TextInput,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import Modal from 'react-native-modal';
import {Picker} from '@react-native-community/picker';
import OptionsMenu from 'react-native-options-menu';
import {Icon} from './assets';

let {width, height} = Dimensions.get('window');

function Home({navigation}) {
  let [data, setData] = useState([]);
  let [loading, setLoading] = useState(false);
  let [postLoading, setPostLoading] = useState(false);
  let [modalVisible, setModalVisible] = useState(false);
  let [dataEdit, setDataEdit] = useState({});
  let [isDataEdit, setIsDataEdit] = useState(false);
  let [no_container, setNoContainer] = useState('');
  let [size, setSize] = useState(0);
  let [type, setType] = useState('');
  let [slot, setSlot] = useState('');
  let [row, setRow] = useState('');
  let [tier, setTier] = useState('');
  useEffect(() => {
    let backHardware = BackHandler.addEventListener('hardwareBackPress', back);
    getData();

    return () => backHardware.remove();
  }, []);

  function back() {
    BackHandler.exitApp();
  }

  async function getData() {
    try {
      setLoading(true);
      let value = await axios.get(
        'https://cikarang-dry-port.herokuapp.com/getData',
      );
      setData(value.data);
      setLoading(false);
    } catch (e) {
      setData(e);
      setLoading(false);
    }
  }

  async function postData() {
    try {
      if (
        no_container === '' ||
        size === 0 ||
        type === '' ||
        slot === '' ||
        row === '' ||
        tier === ''
      ) {
        Alert.alert(
          'Peringatan',
          'Harap isi semua data..',
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
          {cancelable: false},
        );
      } else {
        setPostLoading(true);
        let date = new Date();
        let post = await axios.post(
          'https://cikarang-dry-port.herokuapp.com/postData',
          {
            no_container,
            size,
            type,
            slot: Number(slot),
            row: Number(row),
            tier: Number(tier),
            created_on: date.toISOString().split('T')[0],
          },
        );
        getData();
        setPostLoading(false);
        setModalVisible(false);
        console.log('post data', post);
        setNoContainer('');
        setSize(0);
        setType('');
        setSlot('');
        setRow('');
        setTier('');
      }
    } catch (e) {
      console.log('error post data', e);
      setPostLoading(false);
      setNoContainer('');
      setSize(0);
      setType('');
      setSlot('');
      setRow('');
      setTier('');
      Alert.alert(
        'Peringatan',
        'Terjadi error system...',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    }
  }

  function openEditData(data) {
    console.log('index', data.id);
    setNoContainer(data.no_container);
    setSize(data.size);
    setType(data.type);
    setSlot(data.slot);
    setRow(data.row);
    setTier(data.tier);
    setIsDataEdit(true);
    setDataEdit(data);
    setModalVisible(true);
  }

  function deleteData(data) {
    console.log('index..', data.id);
    Alert.alert(
      'Delete data',
      `Apakah anda yakin ingin menghapus data dengan nomor container : ${
        data.no_container
      }`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Remove', onPress: () => remove(data.id)},
      ],
      {cancelable: false},
    );
  }

  async function remove(id) {
    console.log('id...', id);
    try {
      let remove = await axios.delete(
        `https://cikarang-dry-port.herokuapp.com/deleteData?id=${id}`,
      );
      console.log('remove', remove);
      getData();
    } catch (e) {
      console.log('error', e);
      Alert.alert(
        'Peringatan',
        'Terjadi error system...',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    }
  }

  async function editData() {
    try {
      if (
        no_container === '' ||
        size === 0 ||
        type === '' ||
        slot === '' ||
        row === '' ||
        tier === ''
      ) {
        Alert.alert(
          'Peringatan',
          'Harap isi semua data..',
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
          {cancelable: false},
        );
      } else {
        setPostLoading(true);
        let date = new Date();
        let put = await axios.put(
          'https://cikarang-dry-port.herokuapp.com/updateData',
          {
            no_container,
            size,
            type,
            slot: Number(slot),
            row: Number(row),
            tier: Number(tier),
            created_on: date.toISOString(),
            id: dataEdit.id,
          },
        );
        console.log('edit data..', put);
        getData();
        setPostLoading(false);
        setModalVisible(false);
        setDataEdit({});
        setNoContainer('');
        setSize(0);
        setType('');
        setSlot('');
        setRow('');
        setTier('');
      }
    } catch (e) {
      console.log('error post data', e);
      setPostLoading(false);
      setNoContainer('');
      setSize(0);
      setDataEdit({});
      setType('');
      setSlot('');
      setRow('');
      setTier('');
      Alert.alert(
        'Peringatan',
        'Terjadi error system...',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    }
  }

  function isSetSize({item, index}) {
    setSize(item);
  }

  function renderItem({item, index}) {
    return (
      <View style={styles.card} activeOpacity={0.6} key={String(index)}>
        <View>
          <View style={{marginBottom: 10}}>
            <Text allowFontScaling={false} style={styles.titleTextStyle}>
              No. Container
            </Text>
            <Text allowFontScaling={false} style={styles.descTextStyle}>
              {item.no_container}
            </Text>
          </View>
          {/* <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              width: width * 0.8,
              backgroundColor: '#dbdbdb',
              height: 1,
              marginBottom: 10,
            }}
          /> */}
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: width * 0.8,
            }}>
            <View>
              <Text allowFontScaling={false} style={styles.titleTextStyle}>
                Size
              </Text>
              <Text allowFontScaling={false} style={styles.descTextStyle}>
                {item.size}
              </Text>
            </View>
            <View>
              <Text allowFontScaling={false} style={styles.titleTextStyle}>
                Type
              </Text>
              <Text allowFontScaling={false} style={styles.descTextStyle}>
                {item.type}
              </Text>
            </View>
            <View>
              <Text allowFontScaling={false} style={styles.titleTextStyle}>
                Slot
              </Text>
              <Text allowFontScaling={false} style={styles.descTextStyle}>
                {item.slot}
              </Text>
            </View>
            <View>
              <Text allowFontScaling={false} style={styles.titleTextStyle}>
                Row
              </Text>
              <Text allowFontScaling={false} style={styles.descTextStyle}>
                {item.row}
              </Text>
            </View>
            <View>
              <Text allowFontScaling={false} style={styles.titleTextStyle}>
                Tier
              </Text>
              <Text allowFontScaling={false} style={styles.descTextStyle}>
                {item.tier}
              </Text>
            </View>
          </View>
        </View>
        <OptionsMenu
          button={{
            uri: 'https://i.ya-webdesign.com/images/dot-dot-dot-png-6.png',
          }}
          // eslint-disable-next-line react-native/no-inline-styles
          buttonStyle={{
            width: 20,
            height: 40,
            marginLeft: 7.5,
            resizeMode: 'contain',
          }}
          destructiveIndex={index}
          options={['Edit', 'Delete']}
          actions={[() => openEditData(item), () => deleteData(item)]}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Modal isVisible={modalVisible}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              width: width * 0.85,
              padding: 20,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              paddingLeft: 40,
              borderRadius: 7,
            }}>
            <Text
              style={{color: '#02428a', fontSize: 14}}
              allowFontScaling={false}>
              {isDataEdit ? 'Edit Container' : 'Add Container'}
            </Text>
            <View style={{width: width*0.8, marginTop: 20}}>
              <TextInput
                allowFontScaling={false}
                value={no_container}
                onChangeText={text => setNoContainer(text)}
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  height: 40,
                  borderColor: '#dbdbdb',
                  borderRadius: 5,
                  padding: 5,
                  borderWidth: 1,
                  width: width * 0.6,
                  fontSize: 12,
                }}
                placeholder={'No Container'}
              />
              <View
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  borderWidth: 1,
                  marginTop: 20,
                  width: width * 0.6,
                  borderColor: '#dbdbdb',
                  borderRadius: 5,
                }}>
                <Picker
                  selectedValue={size}
                  itemStyle={{fontSize: 12}}
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    height: 40,
                    width: width * 0.6,
                    color: size === 0 ? '#ababab' : '#000',
                  }}
                  onValueChange={(itemValue, itemIndex) =>
                    isSetSize({item: itemValue, index: itemIndex})
                  }>
                  <Picker.Item label="Select size" value={0} />
                  <Picker.Item label="10" value={10} />
                  <Picker.Item label="20" value={20} />
                  <Picker.Item label="30" value={30} />
                  <Picker.Item label="40" value={40} />
                </Picker>
              </View>
              <View
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  borderWidth: 1,
                  marginTop: 20,
                  width: width * 0.6,
                  borderColor: '#dbdbdb',
                  borderRadius: 5,
                }}>
                <Picker
                  selectedValue={type}
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    height: 40,
                    width: width * 0.6,
                    color: type.length === 0 ? '#ababab' : '#000',
                  }}
                  onValueChange={(itemValue, itemIndex) => setType(itemValue)}>
                  <Picker.Item label="Select type" value={''} />
                  <Picker.Item label="Dry" value={'Dry'} />
                  <Picker.Item label="Other type 1" value={'Other type 1'} />
                  <Picker.Item label="Other type 2" value={'Other type 2'} />
                </Picker>
              </View>
              <TextInput
                allowFontScaling={false}
                onChangeText={text => setSlot(text)}
                keyboardType="numeric"
                value={String(slot)}
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  height: 40,
                  borderColor: '#dbdbdb',
                  borderRadius: 5,
                  padding: 5,
                  borderWidth: 1,
                  width: width * 0.22,
                  marginTop: 10,
                  fontSize: 12,
                }}
                placeholder={'Slot'}
              />
              <TextInput
                allowFontScaling={false}
                onChangeText={text => setRow(text)}
                keyboardType="numeric"
                value={String(row)}
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  height: 40,
                  borderColor: '#dbdbdb',
                  borderRadius: 5,
                  padding: 5,
                  borderWidth: 1,
                  width: width * 0.22,
                  marginTop: 10,
                  fontSize: 12,
                }}
                placeholder={'Row'}
              />
              <TextInput
                allowFontScaling={false}
                onChangeText={text => setTier(text)}
                keyboardType="numeric"
                value={String(tier)}
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  height: 40,
                  borderColor: '#dbdbdb',
                  borderRadius: 5,
                  padding: 5,
                  borderWidth: 1,
                  width: width * 0.22,
                  marginTop: 10,
                  fontSize: 12,
                }}
                placeholder={'Tier'}
              />
            </View>
            <View
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                flexDirection: 'row',
                marginTop: 30,
                width: width * 0.8,
                justifyContent: 'flex-end',
                marginRight: 30,
              }}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{padding: 8, backgroundColor: 'red', borderRadius: 8}}>
                <Text style={{color: '#fff'}}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={isDataEdit ? editData : postData}
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  padding: 8,
                  flexDirection: 'row',
                  backgroundColor:
                    no_container === '' ||
                    size === 0 ||
                    type === '' ||
                    slot === '' ||
                    row === '' ||
                    tier === ''
                      ? '#c9c9c9'
                      : '#02428a',
                  borderRadius: 8,
                  marginLeft: 10,
                }}>
                {postLoading ? (
                  <ActivityIndicator
                    size="small"
                    color="#fff"
                    style={{marginRight: 3}}
                  />
                ) : null}
                <Text style={{color: '#fff'}}>
                  {isDataEdit ? 'Update' : 'Submit'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {loading ? (
        <View style={styles.loadingArea}>
          <ActivityIndicator size="small" color="#02428a" />
        </View>
      ) : (
        <FlatList
          style={styles.flatlistStyle}
          contentContainerStyle={{paddingBottom: 150}}
          data={data}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          onRefresh={getData}
          refreshing={loading}
          ListEmptyComponent={() => (
            <View
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                flex: 1,
                height: height * 0.9,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text allowFontScaling={false} style={styles.titleTextStyle}>
                Data masih kosong
              </Text>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
      <TouchableOpacity
        style={styles.buttonAddArea}
        onPress={() => setModalVisible(true)}>
        <Image source={Icon.addButton} style={styles.buttonAdd} />
      </TouchableOpacity>
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingArea: {
    flex: 1,
    justifyContent: 'center',
  },
  flatlistStyle: {
    paddingTop: 30,
  },
  imgArrowStyle: {
    width: 20,
    height: 50,
    tintColor: '#bdbdbd',
    resizeMode: 'contain',
  },
  card: {
    width: width * 0.95,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderWidth: 1,
    borderColor: '#dbdbdb',
    borderRadius: 5,
  },
  titleTextStyle: {
    color: '#02428a',
    fontSize: 12,
  },
  descTextStyle: {
    color: '#9c9a9b',
    fontSize: 12,
  },
  descTextStyle2: {
    color: '#9c9a9b',
    fontSize: 15,
    marginLeft: 10,
  },
  separator: {
    width: width * 0.95,
    height: 10,
  },
  buttonAdd: {
    width: 100,
    height: 100,
    tintColor: '#02428a',
  },
  buttonAddArea: {
    position: 'absolute',
    bottom: 20,
    right: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
