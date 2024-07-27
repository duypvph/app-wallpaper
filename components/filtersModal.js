import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useMemo } from 'react';
import { BlurView } from 'expo-blur';
import {
    BottomSheetModal,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import Animated, { Extrapolation, FadeInDown, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { hp } from '../helpers/common';
import { theme } from '../constants/theme';
import { CommonFilter, CommonFilterRow, SectionView } from './filterViews';
import { data } from '../constants/data';
import { capitalize } from 'lodash';

const FiltersModal = ({ modalRef, onClose, onApply, onReset, filters, setFilters }) => {
    const snapPoints = useMemo(() => ['75%'], []);

    return (
        <BottomSheetModal
            ref={modalRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backdropComponent={CustomBackdrop}
        >
            <BottomSheetView style={styles.contentContainer}>
                <View style={styles.content}>
                    <Text style={styles.filterText}>Filters</Text>
                    {
                        Object.keys(sections).map((sectionName, index) => {
                            let sectionView = sections[sectionName];
                            let sectionData = data.filters[sectionName];
                            let title = capitalize(sectionName);
                            return (
                                <Animated.View
                                    entering={FadeInDown.delay((index * 100) + 100).springify().damping(11)}
                                    key={sectionName}
                                >
                                    <SectionView 
                                        title={title}
                                        content={sectionView({
                                            data: sectionData,
                                            filters,
                                            setFilters,
                                            filterName: sectionName
                                        })}
                                    />
                                </Animated.View>
                            );
                        })
                    }

                    {/* actions */}
                    <Animated.View
                        entering={FadeInDown.delay(500).springify().damping(11)}
                        style={styles.buttons}
                    >
                        <Pressable style={styles.resetButton} onPress={onReset}>
                            <Text style={[styles.buttonText, { color: theme.colors.neutral(0.9) }]}>Reset</Text>
                        </Pressable>
                        <Pressable style={styles.applyButton} onPress={onApply}>
                            <Text style={[styles.buttonText, { color: theme.colors.white }]}>Apply</Text>
                        </Pressable>
                    </Animated.View>
                </View>
            </BottomSheetView>
        </BottomSheetModal>
    );
}

const sections = {
    "order": (progs) => <CommonFilterRow {...progs} />,
    "orientation": (progs) => <CommonFilterRow {...progs} />,
    "type": (progs) => <CommonFilterRow {...progs} />,
    "colors": (progs) => <CommonFilter {...progs} />
};

const CustomBackdrop = ({ animatedIndex, style }) => {
    const containerAnimatedStyle = useAnimatedStyle(() => {
        let opacity = interpolate(
            animatedIndex.value,
            [-1, 0],
            [0, 1],
            Extrapolation.CLAMP
        );
        return {
            opacity
        };
    });

    const containerStyle = [
        StyleSheet.absoluteFill,
        style,
        styles.overlay,
        containerAnimatedStyle
    ];
    return (
        <Animated.View style={containerStyle}>
            {/* blur view */}
            <BlurView style={StyleSheet.absoluteFill}
                tint='dark'
                intensity={25} />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.5)' // Sửa lỗi định dạng màu sắc
    },
    content: {
        flex: 1,
        gap: 15,
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    filterText: {
        fontSize: hp(4),
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.neutral(0.8),
        marginBottom: 5
    },
    buttons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        width: '100%', // Đảm bảo container chiếm toàn bộ chiều rộng
        paddingHorizontal: 10 // Thêm khoảng cách bên trái và phải
    },
    applyButton: {
        backgroundColor: theme.colors.neutral(0.8),
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.radius.md, // Đã thay đổi từ borderCurve
        flex: 1,
        marginHorizontal: 5
    },
    resetButton: {
        backgroundColor: theme.colors.neutral(0.03),
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.radius.md, // Đã thay đổi từ borderCurve
        borderWidth: 2,
        borderColor: theme.colors.grayBG,
        flex: 1,
        marginHorizontal: 5
    },
    buttonText: {
        fontSize: hp(2.2)
    }
});

export default FiltersModal;
