import React , {useRef} from 'react';
import { Animated, StyleSheet, View, Alert } from 'react-native';

import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {Icon} from 'react-native-elements';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export default function SwipeableRow ({children, onEdit, onDelete}) {
    const inputEl = useRef(null);

    const onEditSelected = () => {
        inputEl.current.close();
        onEdit();
    };

    const onDeleteSelected = () => {
        inputEl.current.close();
        Alert.alert(
            'Delete Event',
            "Are you sure you want to delete this event?",
            [
                {text: 'Delete', onPress: () => onDelete()},
                {text: 'Cancel', style: 'cancel'}
            ],
            {cancelable: true},
        );
    };

    const renderRightActions = (progress, dragX) => {
        const scale = dragX.interpolate({
            inputRange: [-80, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });
        return (
            <View style={styles.buttons}>
                {
                    onEdit &&
                        <RectButton style={[styles.rightAction, styles.editAction]} onPress={onEditSelected}>
                        <AnimatedIcon
                            type={'material'}
                            name="edit"
                            size={30}
                            color="#fff"
                            style={[styles.actionIcon, {transform: [{scale}]}]}
                        />
                    </RectButton>
                }
                {
                    onDelete &&
                    <RectButton style={[styles.rightAction, styles.deleteAction]} onPress={onDeleteSelected}>
                        <AnimatedIcon
                            type={'material'}
                            name="delete-forever"
                            size={30}
                            color="#fff"
                            style={[styles.actionIcon, {transform: [{scale}]}]}
                        />
                    </RectButton>
                }
            </View>
        );
    };

    return (
        <Swipeable ref={inputEl}
                   friction={2}
                   leftThreshold={80}
                   rightThreshold={40} renderRightActions={renderRightActions}>
            {children}
        </Swipeable>

    )
}

const styles = StyleSheet.create({
    actionIcon: {
        width: 30,
        marginHorizontal: 10
    },

    buttons: {
        width: 190,
        flexDirection: 'row'
    },

    rightAction: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        width: 95
    },

    editAction: {
        backgroundColor: '#497AFC'
    },

    deleteAction: {
        backgroundColor: '#dd2c00'
    },

    actionText: {
        color: '#fff',
        fontWeight: '600',
        padding: 20,
    }
});