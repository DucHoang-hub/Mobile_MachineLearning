import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Extended product data with more details
const PRODUCTS_DATA: { [key: string]: any[] } = {
    'Chairs': [
        {
            id: '1',
            name: 'Buddy Chair',
            description: 'The buddy chair with modern comfort and durable fabric.',
            price: 102.25,
            oldPrice: 120.00,
            discount: 20,
            rating: 5.0,
            totalRatings: 25586,
            reviews: 430,
            dimensions: { height: '115 cm', width: '115 cm', depth: '115 cm', weight: '115 cm' },
            colors: ['#FFB800', '#2C5F8D', '#C4893B', '#1a2632'],
            productViews: [
                { label: 'Front', image: require('../assets/images/screen3_img1.png') },
                { label: 'Back', image: require('../assets/images/screen3_img2.png') },
                { label: 'Left', image: require('../assets/images/screen3_img3.png') },
                { label: 'Right', image: require('../assets/images/screen3_img4.png') },
            ],
            ratingBreakdown: { 5: 90, 4: 75, 3: 50, 2: 25, 1: 10 },
        },
        {
            id: '2',
            name: 'Wingback Chair',
            description: 'Elegant wingback design with premium upholstery.',
            price: 89.99,
            oldPrice: 115.00,
            discount: 22,
            rating: 4.8,
            totalRatings: 18420,
            reviews: 312,
            dimensions: { height: '110 cm', width: '85 cm', depth: '90 cm', weight: '18 kg' },
            colors: ['#8B7355', '#2C5F8D', '#1a2632'],
            productViews: [
                { label: 'Front', image: require('../assets/images/screen3_img2.png') },
                { label: 'Back', image: require('../assets/images/screen3_img1.png') },
                { label: 'Left', image: require('../assets/images/screen3_img3.png') },
                { label: 'Right', image: require('../assets/images/screen3_img5.png') },
            ],
            ratingBreakdown: { 5: 85, 4: 70, 3: 45, 2: 20, 1: 8 },
        },
        {
            id: '3',
            name: 'Winston Chair',
            description: 'Classic Winston chair with timeless appeal.',
            price: 76.50,
            oldPrice: 95.00,
            discount: 19,
            rating: 4.6,
            totalRatings: 12350,
            reviews: 245,
            dimensions: { height: '105 cm', width: '80 cm', depth: '85 cm', weight: '15 kg' },
            colors: ['#C4893B', '#FFB800', '#1a2632'],
            productViews: [
                { label: 'Front', image: require('../assets/images/screen3_img3.png') },
                { label: 'Back', image: require('../assets/images/screen3_img1.png') },
                { label: 'Left', image: require('../assets/images/screen3_img2.png') },
                { label: 'Right', image: require('../assets/images/screen3_img6.png') },
            ],
            ratingBreakdown: { 5: 80, 4: 65, 3: 40, 2: 18, 1: 12 },
        },
        {
            id: '4',
            name: 'Beige Chair',
            description: 'Soft beige fabric with ergonomic support.',
            price: 68.00,
            oldPrice: 85.00,
            discount: 20,
            rating: 4.5,
            totalRatings: 9870,
            reviews: 198,
            dimensions: { height: '100 cm', width: '75 cm', depth: '80 cm', weight: '12 kg' },
            colors: ['#D4C4A8', '#2C5F8D', '#1a2632'],
            productViews: [
                { label: 'Front', image: require('../assets/images/screen3_img4.png') },
                { label: 'Back', image: require('../assets/images/screen3_img1.png') },
                { label: 'Left', image: require('../assets/images/screen3_img2.png') },
                { label: 'Right', image: require('../assets/images/screen3_img3.png') },
            ],
            ratingBreakdown: { 5: 75, 4: 60, 3: 35, 2: 15, 1: 10 },
        },
        {
            id: '5',
            name: 'Dining Chair',
            description: 'Perfect for dining rooms with modern aesthetics.',
            price: 45.00,
            oldPrice: 60.00,
            discount: 25,
            rating: 4.4,
            totalRatings: 15680,
            reviews: 287,
            dimensions: { height: '95 cm', width: '50 cm', depth: '55 cm', weight: '8 kg' },
            colors: ['#1a2632', '#8B7355'],
            productViews: [
                { label: 'Front', image: require('../assets/images/screen3_img5.png') },
                { label: 'Back', image: require('../assets/images/screen3_img1.png') },
                { label: 'Left', image: require('../assets/images/screen3_img2.png') },
                { label: 'Right', image: require('../assets/images/screen3_img4.png') },
            ],
            ratingBreakdown: { 5: 70, 4: 55, 3: 30, 2: 12, 1: 8 },
        },
        {
            id: '6',
            name: 'Harbour Chair',
            description: 'Inspired by coastal living with relaxed vibes.',
            price: 92.00,
            oldPrice: 110.00,
            discount: 16,
            rating: 4.7,
            totalRatings: 8450,
            reviews: 156,
            dimensions: { height: '108 cm', width: '82 cm', depth: '88 cm', weight: '16 kg' },
            colors: ['#5D7EA0', '#FFB800', '#1a2632'],
            productViews: [
                { label: 'Front', image: require('../assets/images/screen3_img6.png') },
                { label: 'Back', image: require('../assets/images/screen3_img1.png') },
                { label: 'Left', image: require('../assets/images/screen3_img2.png') },
                { label: 'Right', image: require('../assets/images/screen3_img3.png') },
            ],
            ratingBreakdown: { 5: 82, 4: 68, 3: 42, 2: 16, 1: 6 },
        },
    ],
    'Tables': [
        {
            id: '1',
            name: 'Modern Table',
            description: 'Sleek modern design for contemporary spaces.',
            price: 120,
            oldPrice: 150,
            discount: 20,
            rating: 4.5,
            totalRatings: 8500,
            reviews: 180,
            dimensions: { height: '75 cm', width: '160 cm', depth: '90 cm', weight: '35 kg' },
            colors: ['#8B7355', '#1a2632'],
            productViews: [
                { label: 'Front', image: require('../assets/images/screen3_img7.png') },
                { label: 'Back', image: require('../assets/images/screen3_img8.png') },
                { label: 'Left', image: require('../assets/images/screen3_img9.png') },
                { label: 'Right', image: require('../assets/images/screen3_img10.png') },
            ],
            ratingBreakdown: { 5: 78, 4: 62, 3: 38, 2: 14, 1: 8 },
        },
        {
            id: '2',
            name: 'Dining Table',
            description: 'Family sized table for memorable dinners.',
            price: 200,
            oldPrice: 250,
            discount: 20,
            rating: 4.6,
            totalRatings: 12300,
            reviews: 245,
            dimensions: { height: '76 cm', width: '180 cm', depth: '100 cm', weight: '45 kg' },
            colors: ['#D4C4A8', '#1a2632'],
            productViews: [
                { label: 'Front', image: require('../assets/images/screen3_img8.png') },
                { label: 'Back', image: require('../assets/images/screen3_img7.png') },
                { label: 'Left', image: require('../assets/images/screen3_img9.png') },
                { label: 'Right', image: require('../assets/images/screen3_img10.png') },
            ],
            ratingBreakdown: { 5: 82, 4: 65, 3: 40, 2: 12, 1: 6 },
        },
        {
            id: '3',
            name: 'Coffee Table',
            description: 'Minimalist coffee table for your living room.',
            price: 85,
            oldPrice: 110,
            discount: 23,
            rating: 4.7,
            totalRatings: 6800,
            reviews: 132,
            dimensions: { height: '45 cm', width: '120 cm', depth: '60 cm', weight: '18 kg' },
            colors: ['#C4893B', '#1a2632'],
            productViews: [
                { label: 'Front', image: require('../assets/images/screen3_img9.png') },
                { label: 'Back', image: require('../assets/images/screen3_img7.png') },
                { label: 'Left', image: require('../assets/images/screen3_img8.png') },
                { label: 'Right', image: require('../assets/images/screen3_img10.png') },
            ],
            ratingBreakdown: { 5: 85, 4: 70, 3: 35, 2: 10, 1: 5 },
        },
        {
            id: '4',
            name: 'Side Table',
            description: 'Compact side table for tight spaces.',
            price: 45,
            oldPrice: 60,
            discount: 25,
            rating: 4.4,
            totalRatings: 4500,
            reviews: 98,
            dimensions: { height: '55 cm', width: '45 cm', depth: '45 cm', weight: '8 kg' },
            colors: ['#5D7EA0', '#1a2632'],
            productViews: [
                { label: 'Front', image: require('../assets/images/screen3_img10.png') },
                { label: 'Back', image: require('../assets/images/screen3_img7.png') },
                { label: 'Left', image: require('../assets/images/screen3_img8.png') },
                { label: 'Right', image: require('../assets/images/screen3_img9.png') },
            ],
            ratingBreakdown: { 5: 72, 4: 58, 3: 32, 2: 18, 1: 10 },
        },
    ],
    'Sofas': [
        {
            id: '1',
            name: 'Comfort Sofa',
            description: 'Ultra soft cushions for maximum relaxation.',
            price: 350,
            oldPrice: 450,
            discount: 22,
            rating: 4.8,
            totalRatings: 15600,
            reviews: 320,
            dimensions: { height: '85 cm', width: '220 cm', depth: '95 cm', weight: '65 kg' },
            colors: ['#8B7355', '#2C5F8D', '#1a2632'],
            productViews: [
                { label: 'Front', image: require('../assets/images/screen3_img11.png') },
                { label: 'Back', image: require('../assets/images/screen3_img12.png') },
                { label: 'Left', image: require('../assets/images/screen3_img13.png') },
                { label: 'Right', image: require('../assets/images/screen3_img14.png') },
            ],
            ratingBreakdown: { 5: 88, 4: 72, 3: 42, 2: 15, 1: 5 },
        },
        {
            id: '2',
            name: 'Modern Sofa',
            description: 'Contemporary design with clean lines.',
            price: 400,
            oldPrice: 500,
            discount: 20,
            rating: 4.7,
            totalRatings: 12800,
            reviews: 275,
            dimensions: { height: '82 cm', width: '240 cm', depth: '100 cm', weight: '72 kg' },
            colors: ['#C4893B', '#1a2632'],
            productViews: [
                { label: 'Front', image: require('../assets/images/screen3_img12.png') },
                { label: 'Back', image: require('../assets/images/screen3_img11.png') },
                { label: 'Left', image: require('../assets/images/screen3_img13.png') },
                { label: 'Right', image: require('../assets/images/screen3_img14.png') },
            ],
            ratingBreakdown: { 5: 85, 4: 68, 3: 38, 2: 12, 1: 7 },
        },
        {
            id: '3',
            name: 'L-Shape Sofa',
            description: 'Spacious L-shaped design for corner spaces.',
            price: 550,
            oldPrice: 650,
            discount: 15,
            rating: 4.9,
            totalRatings: 8900,
            reviews: 198,
            dimensions: { height: '88 cm', width: '280 cm', depth: '180 cm', weight: '95 kg' },
            colors: ['#5D7EA0', '#D4C4A8', '#1a2632'],
            productViews: [
                { label: 'Front', image: require('../assets/images/screen3_img13.png') },
                { label: 'Back', image: require('../assets/images/screen3_img11.png') },
                { label: 'Left', image: require('../assets/images/screen3_img12.png') },
                { label: 'Right', image: require('../assets/images/screen3_img14.png') },
            ],
            ratingBreakdown: { 5: 92, 4: 75, 3: 45, 2: 10, 1: 3 },
        },
        {
            id: '4',
            name: 'Velvet Sofa',
            description: 'Luxurious velvet upholstery for elegance.',
            price: 480,
            oldPrice: 600,
            discount: 20,
            rating: 4.6,
            totalRatings: 7200,
            reviews: 165,
            dimensions: { height: '80 cm', width: '200 cm', depth: '90 cm', weight: '58 kg' },
            colors: ['#6B4C7A', '#C4893B', '#1a2632'],
            productViews: [
                { label: 'Front', image: require('../assets/images/screen3_img14.png') },
                { label: 'Back', image: require('../assets/images/screen3_img11.png') },
                { label: 'Left', image: require('../assets/images/screen3_img12.png') },
                { label: 'Right', image: require('../assets/images/screen3_img13.png') },
            ],
            ratingBreakdown: { 5: 80, 4: 65, 3: 40, 2: 18, 1: 8 },
        },
    ],
    'Hanging chairs': [
        {
            id: '1',
            name: 'Swing Chair',
            description: 'Relaxing swing design for indoor/outdoor use.',
            price: 95,
            oldPrice: 120,
            discount: 21,
            rating: 4.5,
            totalRatings: 5600,
            reviews: 125,
            dimensions: { height: '120 cm', width: '80 cm', depth: '80 cm', weight: '15 kg' },
            colors: ['#D4C4A8', '#1a2632'],
            productViews: [
                { label: 'Front', image: require('../assets/images/screen3_img15.png') },
                { label: 'Back', image: require('../assets/images/screen3_img16.png') },
                { label: 'Left', image: require('../assets/images/screen3_img1.png') },
                { label: 'Right', image: require('../assets/images/screen3_img2.png') },
            ],
            ratingBreakdown: { 5: 75, 4: 60, 3: 35, 2: 15, 1: 10 },
        },
        {
            id: '2',
            name: 'Hammock Chair',
            description: 'Perfect for patios and outdoor relaxation.',
            price: 110,
            oldPrice: 140,
            discount: 21,
            rating: 4.6,
            totalRatings: 4800,
            reviews: 108,
            dimensions: { height: '130 cm', width: '90 cm', depth: '85 cm', weight: '12 kg' },
            colors: ['#8B7355', '#2C5F8D'],
            productViews: [
                { label: 'Front', image: require('../assets/images/screen3_img16.png') },
                { label: 'Back', image: require('../assets/images/screen3_img15.png') },
                { label: 'Left', image: require('../assets/images/screen3_img1.png') },
                { label: 'Right', image: require('../assets/images/screen3_img2.png') },
            ],
            ratingBreakdown: { 5: 78, 4: 62, 3: 38, 2: 12, 1: 8 },
        },
        {
            id: '3',
            name: 'Pod Chair',
            description: 'Modern pod design for cozy reading corners.',
            price: 150,
            oldPrice: 180,
            discount: 17,
            rating: 4.7,
            totalRatings: 3500,
            reviews: 82,
            dimensions: { height: '140 cm', width: '95 cm', depth: '90 cm', weight: '18 kg' },
            colors: ['#1a2632', '#C4893B'],
            productViews: [
                { label: 'Front', image: require('../assets/images/screen3_img1.png') },
                { label: 'Back', image: require('../assets/images/screen3_img15.png') },
                { label: 'Left', image: require('../assets/images/screen3_img16.png') },
                { label: 'Right', image: require('../assets/images/screen3_img2.png') },
            ],
            ratingBreakdown: { 5: 82, 4: 68, 3: 40, 2: 10, 1: 5 },
        },
        {
            id: '4',
            name: 'Basket Chair',
            description: 'Woven basket design with natural aesthetics.',
            price: 85,
            oldPrice: 100,
            discount: 15,
            rating: 4.4,
            totalRatings: 2800,
            reviews: 65,
            dimensions: { height: '115 cm', width: '85 cm', depth: '80 cm', weight: '10 kg' },
            colors: ['#D4C4A8', '#8B7355'],
            productViews: [
                { label: 'Front', image: require('../assets/images/screen3_img2.png') },
                { label: 'Back', image: require('../assets/images/screen3_img15.png') },
                { label: 'Left', image: require('../assets/images/screen3_img16.png') },
                { label: 'Right', image: require('../assets/images/screen3_img1.png') },
            ],
            ratingBreakdown: { 5: 70, 4: 55, 3: 32, 2: 18, 1: 12 },
        },
    ],
    'Cabinets': [
        {
            id: '1',
            name: 'Storage Cabinet',
            description: 'Multiple shelves for organized storage.',
            price: 180,
            oldPrice: 220,
            discount: 18,
            rating: 4.5,
            totalRatings: 6200,
            reviews: 142,
            dimensions: { height: '180 cm', width: '80 cm', depth: '45 cm', weight: '48 kg' },
            colors: ['#D4C4A8', '#1a2632'],
            productViews: [
                { label: 'Front', image: require('../assets/images/screen3_img17.png') },
                { label: 'Back', image: require('../assets/images/screen3_img3.png') },
                { label: 'Left', image: require('../assets/images/screen3_img4.png') },
                { label: 'Right', image: require('../assets/images/screen3_img5.png') },
            ],
            ratingBreakdown: { 5: 76, 4: 62, 3: 38, 2: 14, 1: 8 },
        },
        {
            id: '2',
            name: 'Display Cabinet',
            description: 'Glass doors to showcase your collection.',
            price: 250,
            oldPrice: 300,
            discount: 17,
            rating: 4.6,
            totalRatings: 4800,
            reviews: 115,
            dimensions: { height: '190 cm', width: '100 cm', depth: '40 cm', weight: '55 kg' },
            colors: ['#8B7355', '#1a2632'],
            productViews: [
                { label: 'Front', image: require('../assets/images/screen3_img3.png') },
                { label: 'Back', image: require('../assets/images/screen3_img17.png') },
                { label: 'Left', image: require('../assets/images/screen3_img4.png') },
                { label: 'Right', image: require('../assets/images/screen3_img5.png') },
            ],
            ratingBreakdown: { 5: 80, 4: 65, 3: 35, 2: 12, 1: 6 },
        },
        {
            id: '3',
            name: 'TV Cabinet',
            description: 'Sleek media storage for your entertainment setup.',
            price: 200,
            oldPrice: 260,
            discount: 23,
            rating: 4.7,
            totalRatings: 5500,
            reviews: 128,
            dimensions: { height: '55 cm', width: '160 cm', depth: '45 cm', weight: '38 kg' },
            colors: ['#1a2632', '#C4893B'],
            productViews: [
                { label: 'Front', image: require('../assets/images/screen3_img4.png') },
                { label: 'Back', image: require('../assets/images/screen3_img17.png') },
                { label: 'Left', image: require('../assets/images/screen3_img3.png') },
                { label: 'Right', image: require('../assets/images/screen3_img5.png') },
            ],
            ratingBreakdown: { 5: 84, 4: 70, 3: 38, 2: 10, 1: 5 },
        },
        {
            id: '4',
            name: 'File Cabinet',
            description: 'Office organizer with locking drawers.',
            price: 120,
            oldPrice: 150,
            discount: 20,
            rating: 4.3,
            totalRatings: 3200,
            reviews: 78,
            dimensions: { height: '70 cm', width: '40 cm', depth: '50 cm', weight: '25 kg' },
            colors: ['#5D7EA0', '#1a2632'],
            productViews: [
                { label: 'Front', image: require('../assets/images/screen3_img5.png') },
                { label: 'Back', image: require('../assets/images/screen3_img17.png') },
                { label: 'Left', image: require('../assets/images/screen3_img3.png') },
                { label: 'Right', image: require('../assets/images/screen3_img4.png') },
            ],
            ratingBreakdown: { 5: 68, 4: 55, 3: 40, 2: 20, 1: 12 },
        },
    ],
    'Lamps': [
        {
            id: '1',
            name: 'Floor Lamp',
            description: 'Adjustable height for reading and ambiance.',
            price: 65,
            oldPrice: 85,
            discount: 24,
            rating: 4.5,
            totalRatings: 7800,
            reviews: 165,
            dimensions: { height: '160 cm', width: '35 cm', depth: '35 cm', weight: '8 kg' },
            colors: ['#FFB800', '#1a2632'],
            images: [
                require('../assets/images/screen3_img6.png'),
                require('../assets/images/screen3_img7.png'),
                require('../assets/images/screen3_img8.png'),
            ],
            ratingBreakdown: { 5: 78, 4: 62, 3: 35, 2: 15, 1: 8 },
        },
        {
            id: '2',
            name: 'Table Lamp',
            description: 'Bedside lighting with soft glow.',
            price: 35,
            oldPrice: 45,
            discount: 22,
            rating: 4.4,
            totalRatings: 9200,
            reviews: 198,
            dimensions: { height: '45 cm', width: '25 cm', depth: '25 cm', weight: '3 kg' },
            colors: ['#D4C4A8', '#2C5F8D'],
            productViews: [
                { label: 'Front', image: require('../assets/images/screen3_img7.png') },
                { label: 'Back', image: require('../assets/images/screen3_img6.png') },
                { label: 'Left', image: require('../assets/images/screen3_img8.png') },
                { label: 'Right', image: require('../assets/images/screen3_img9.png') },
            ],
            ratingBreakdown: { 5: 72, 4: 58, 3: 38, 2: 18, 1: 10 },
        },
        {
            id: '3',
            name: 'Desk Lamp',
            description: 'Focused lighting for study and work.',
            price: 40,
            oldPrice: 55,
            discount: 27,
            rating: 4.6,
            totalRatings: 11500,
            reviews: 245,
            dimensions: { height: '50 cm', width: '20 cm', depth: '30 cm', weight: '4 kg' },
            colors: ['#1a2632', '#C4893B'],
            productViews: [
                { label: 'Front', image: require('../assets/images/screen3_img8.png') },
                { label: 'Back', image: require('../assets/images/screen3_img6.png') },
                { label: 'Left', image: require('../assets/images/screen3_img7.png') },
                { label: 'Right', image: require('../assets/images/screen3_img9.png') },
            ],
            ratingBreakdown: { 5: 82, 4: 68, 3: 32, 2: 12, 1: 6 },
        },
        {
            id: '4',
            name: 'Wall Lamp',
            description: 'Space-saving wall-mounted design.',
            price: 50,
            oldPrice: 70,
            discount: 29,
            rating: 4.5,
            totalRatings: 5600,
            reviews: 125,
            dimensions: { height: '30 cm', width: '20 cm', depth: '25 cm', weight: '2 kg' },
            colors: ['#8B7355', '#FFB800'],
            productViews: [
                { label: 'Front', image: require('../assets/images/screen3_img9.png') },
                { label: 'Back', image: require('../assets/images/screen3_img6.png') },
                { label: 'Left', image: require('../assets/images/screen3_img7.png') },
                { label: 'Right', image: require('../assets/images/screen3_img8.png') },
            ],
            ratingBreakdown: { 5: 76, 4: 60, 3: 36, 2: 16, 1: 9 },
        },
    ],
    'Cupboards': [
        {
            id: '1',
            name: 'Kitchen Cupboard',
            description: 'Storage solution for kitchen essentials.',
            price: 220,
            oldPrice: 280,
            discount: 21,
            rating: 4.5,
            totalRatings: 4800,
            reviews: 108,
            dimensions: { height: '200 cm', width: '100 cm', depth: '50 cm', weight: '65 kg' },
            colors: ['#D4C4A8', '#1a2632'],
            productViews: [
                { label: 'Front', image: require('../assets/images/screen3_img10.png') },
                { label: 'Back', image: require('../assets/images/screen3_img11.png') },
                { label: 'Left', image: require('../assets/images/screen3_img12.png') },
                { label: 'Right', image: require('../assets/images/screen3_img13.png') },
            ],
            ratingBreakdown: { 5: 74, 4: 60, 3: 38, 2: 16, 1: 10 },
        },
        {
            id: '2',
            name: 'Bedroom Cupboard',
            description: 'Wardrobe-style storage for clothes.',
            price: 300,
            oldPrice: 380,
            discount: 21,
            rating: 4.7,
            totalRatings: 6200,
            reviews: 142,
            dimensions: { height: '220 cm', width: '150 cm', depth: '60 cm', weight: '85 kg' },
            colors: ['#8B7355', '#1a2632'],
            productViews: [
                { label: 'Front', image: require('../assets/images/screen3_img11.png') },
                { label: 'Back', image: require('../assets/images/screen3_img10.png') },
                { label: 'Left', image: require('../assets/images/screen3_img12.png') },
                { label: 'Right', image: require('../assets/images/screen3_img13.png') },
            ],
            ratingBreakdown: { 5: 82, 4: 68, 3: 35, 2: 12, 1: 5 },
        },
        {
            id: '3',
            name: 'Corner Cupboard',
            description: 'Space-efficient design for corners.',
            price: 160,
            oldPrice: 200,
            discount: 20,
            rating: 4.4,
            totalRatings: 3500,
            reviews: 85,
            dimensions: { height: '180 cm', width: '80 cm', depth: '80 cm', weight: '45 kg' },
            colors: ['#C4893B', '#1a2632'],
            productViews: [
                { label: 'Front', image: require('../assets/images/screen3_img12.png') },
                { label: 'Back', image: require('../assets/images/screen3_img10.png') },
                { label: 'Left', image: require('../assets/images/screen3_img11.png') },
                { label: 'Right', image: require('../assets/images/screen3_img13.png') },
            ],
            ratingBreakdown: { 5: 70, 4: 55, 3: 40, 2: 18, 1: 12 },
        },
        {
            id: '4',
            name: 'Tall Cupboard',
            description: 'Extra storage with vertical design.',
            price: 240,
            oldPrice: 300,
            discount: 20,
            rating: 4.6,
            totalRatings: 4200,
            reviews: 98,
            dimensions: { height: '240 cm', width: '60 cm', depth: '45 cm', weight: '55 kg' },
            colors: ['#5D7EA0', '#D4C4A8'],
            images: [
                require('../assets/images/screen3_img13.png'),
                require('../assets/images/screen3_img10.png'),
                require('../assets/images/screen3_img11.png'),
            ],
            ratingBreakdown: { 5: 78, 4: 65, 3: 38, 2: 14, 1: 8 },
        },
    ],
};

// Similar products
const SIMILAR_PRODUCTS = [
    {
        id: 'sim1',
        name: 'Buddy Chair',
        description: 'Modern saddle arms',
        price: 14,
        oldPrice: 20,
        rating: 4.5,
        image: require('../assets/images/screen3_img1.png'),
    },
    {
        id: 'sim2',
        name: 'Wingback Chair',
        description: 'Modern saddle arms',
        price: 15,
        oldPrice: 18,
        rating: 4.5,
        image: require('../assets/images/screen3_img2.png'),
    },
    {
        id: 'sim3',
        name: 'Winston Chair',
        description: 'Modern saddle arms',
        price: 20,
        oldPrice: 25,
        rating: 4.5,
        image: require('../assets/images/screen3_img3.png'),
    },
    {
        id: 'sim4',
        name: 'Beige Chair',
        description: 'Modern saddle arms',
        price: 16,
        oldPrice: 21,
        rating: 4.5,
        image: require('../assets/images/screen3_img4.png'),
    },
];

export default function ProductDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const categoryTitle = params.category as string || 'Chairs';
    const productId = params.id as string || '1';

    // Find the product
    const categoryProducts = PRODUCTS_DATA[categoryTitle] || PRODUCTS_DATA['Chairs'];
    const product = categoryProducts.find(p => p.id === productId) || categoryProducts[0];

    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [pincode, setPincode] = useState('');
    const [showFullDetails, setShowFullDetails] = useState(false);

    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null);

    const totalPrice = (product.price * quantity).toFixed(2);

    const handleQuantityChange = (increment: boolean) => {
        if (increment) {
            setQuantity(prev => prev + 1);
        } else if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleImageScroll = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / SCREEN_WIDTH);
        setCurrentImageIndex(index);
    };

    const goToImage = (index: number) => {
        flatListRef.current?.scrollToIndex({ index, animated: true });
        setCurrentImageIndex(index);
    };

    const renderImageCarousel = () => (
        <View style={styles.carouselContainer}>
            {/* View label indicator */}
            <View style={styles.viewLabelContainer}>
                <Text style={styles.viewLabelText}>
                    {product.productViews?.[currentImageIndex]?.label || 'View'}
                </Text>
            </View>

            {/* Thumbnail navigation with labels */}
            <View style={styles.thumbnailRow}>
                {(product.productViews || []).map((view: any, index: number) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.thumbnailWithLabel,
                            currentImageIndex === index && styles.thumbnailActiveWithLabel
                        ]}
                        onPress={() => goToImage(index)}
                    >
                        <View style={[
                            styles.thumbnailImageBox,
                            currentImageIndex === index && { borderColor: '#1a2632' }
                        ]}>
                            <Image source={view.image} style={styles.thumbnail} resizeMode="contain" />
                        </View>
                        <Text style={[
                            styles.thumbnailLabelText,
                            currentImageIndex === index && styles.thumbnailLabelTextActive
                        ]}>
                            {view.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Main image carousel */}
            <View style={styles.mainImageContainer}>
                <FlatList
                    ref={flatListRef}
                    data={product.productViews || []}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleImageScroll}
                    scrollEventThrottle={16}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.imageSlide}>
                            <View style={styles.mainImageCircle}>
                                <Image source={item.image} style={styles.mainImage} resizeMode="contain" />
                            </View>
                        </View>
                    )}
                />

                {/* Navigation arrows */}
                <TouchableOpacity
                    style={[styles.navArrow, styles.navArrowLeft]}
                    onPress={() => currentImageIndex > 0 && goToImage(currentImageIndex - 1)}
                >
                    <Ionicons name="chevron-back" size={20} color="#8B9DB8" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.navArrow, styles.navArrowRight]}
                    onPress={() => currentImageIndex < (product.productViews?.length || 1) - 1 && goToImage(currentImageIndex + 1)}
                >
                    <Ionicons name="chevron-forward" size={20} color="#8B9DB8" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderColorOptions = () => (
        <View style={styles.colorSection}>
            {product.colors.map((color: string, index: number) => (
                <TouchableOpacity
                    key={index}
                    style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        selectedColor === index && styles.colorOptionSelected
                    ]}
                    onPress={() => setSelectedColor(index)}
                />
            ))}
        </View>
    );

    const renderDimensions = () => (
        <View style={styles.dimensionsContainer}>
            <View style={styles.dimensionItem}>
                <View style={styles.dimensionIcon}>
                    <Ionicons name="resize-outline" size={20} color="#1a2632" />
                </View>
                <Text style={styles.dimensionValue}>{product.dimensions.height}</Text>
            </View>
            <View style={styles.dimensionItem}>
                <View style={styles.dimensionIcon}>
                    <Ionicons name="scan-outline" size={20} color="#1a2632" />
                </View>
                <Text style={styles.dimensionValue}>{product.dimensions.width}</Text>
            </View>
            <View style={styles.dimensionItem}>
                <View style={styles.dimensionIcon}>
                    <Ionicons name="cube-outline" size={20} color="#1a2632" />
                </View>
                <Text style={styles.dimensionValue}>{product.dimensions.depth}</Text>
            </View>
            <View style={styles.dimensionItem}>
                <View style={styles.dimensionIcon}>
                    <Ionicons name="barbell-outline" size={20} color="#1a2632" />
                </View>
                <Text style={styles.dimensionValue}>{product.dimensions.weight}</Text>
            </View>
        </View>
    );

    const renderDeliverySection = () => (
        <View style={styles.deliverySection}>
            <Text style={styles.sectionTitle}>Check Delivery</Text>
            <Text style={styles.deliverySubtitle}>Enter pincode to check delivery date / pickup</Text>

            <View style={styles.pincodeContainer}>
                <TextInput
                    style={styles.pincodeInput}
                    placeholder="Pincode"
                    placeholderTextColor="#8B9DB8"
                    value={pincode}
                    onChangeText={setPincode}
                    keyboardType="numeric"
                />
                <TouchableOpacity style={styles.checkButton}>
                    <Text style={styles.checkButtonText}>Check</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.deliveryOptions}>
                <View style={styles.deliveryOption}>
                    <View style={styles.deliveryIconCircle}>
                        <Ionicons name="car-outline" size={24} color="#1a2632" />
                    </View>
                    <Text style={styles.deliveryOptionText}>Free</Text>
                    <Text style={styles.deliveryOptionText}>Delivery</Text>
                </View>
                <View style={styles.deliveryOption}>
                    <View style={styles.deliveryIconCircle}>
                        <Ionicons name="cash-outline" size={24} color="#1a2632" />
                    </View>
                    <Text style={styles.deliveryOptionText}>Cash</Text>
                    <Text style={styles.deliveryOptionText}>On</Text>
                    <Text style={styles.deliveryOptionText}>Delivery</Text>
                </View>
                <View style={styles.deliveryOption}>
                    <View style={styles.deliveryIconCircle}>
                        <Ionicons name="refresh-outline" size={24} color="#1a2632" />
                    </View>
                    <Text style={styles.deliveryOptionText}>21 days</Text>
                    <Text style={styles.deliveryOptionText}>Return</Text>
                </View>
            </View>
        </View>
    );

    const renderRatingBreakdown = () => (
        <View style={styles.ratingSection}>
            <View style={styles.ratingLeft}>
                <Text style={styles.ratingScore}>{product.rating.toFixed(1)}</Text>
                <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Ionicons
                            key={star}
                            name={star <= Math.floor(product.rating) ? "star" : "star-outline"}
                            size={14}
                            color="#FFB800"
                        />
                    ))}
                </View>
                <Text style={styles.ratingCount}>
                    {product.totalRatings.toLocaleString()}
                </Text>
                <Text style={styles.ratingLabel}>Rating \ {product.reviews}</Text>
                <Text style={styles.ratingLabel}>Reviews</Text>
            </View>

            <View style={styles.ratingBreakdown}>
                {[5, 4, 3, 2, 1].map((star) => (
                    <View key={star} style={styles.ratingBar}>
                        <Text style={styles.ratingStarNum}>{star}</Text>
                        <Ionicons name="star" size={12} color="#FFB800" />
                        <View style={styles.ratingBarBg}>
                            <View
                                style={[
                                    styles.ratingBarFill,
                                    { width: `${product.ratingBreakdown[star]}%` }
                                ]}
                            />
                        </View>
                        <Text style={styles.ratingPercent}>{product.ratingBreakdown[star]}%</Text>
                    </View>
                ))}
            </View>
        </View>
    );

    const renderSimilarProducts = () => (
        <View style={styles.similarSection}>
            <View style={styles.similarHeader}>
                <Text style={styles.similarTitle}>Similar Products</Text>
                <TouchableOpacity>
                    <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {SIMILAR_PRODUCTS.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.similarCard}
                        onPress={() => router.push({
                            pathname: '/product-detail',
                            params: { category: categoryTitle, id: item.id }
                        })}
                    >
                        <View style={styles.similarImageContainer}>
                            <Image source={item.image} style={styles.similarImage} resizeMode="contain" />
                            <TouchableOpacity style={styles.similarAddButton}>
                                <Ionicons name="bag-add" size={18} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.similarName} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.similarDesc} numberOfLines={1}>{item.description}</Text>
                        <View style={styles.similarPriceRow}>
                            <View style={styles.similarPrices}>
                                <Text style={styles.similarPrice}>${item.price}</Text>
                                <Text style={styles.similarOldPrice}>${item.oldPrice}</Text>
                            </View>
                            <View style={styles.similarRating}>
                                <Ionicons name="star" size={12} color="#FFB800" />
                                <Text style={styles.similarRatingText}>{item.rating}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#1a2632" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>{categoryTitle}</Text>

                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.headerButton}>
                        <Ionicons name="search-outline" size={24} color="#1a2632" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => setIsFavorite(!isFavorite)}
                    >
                        <Ionicons
                            name={isFavorite ? "heart" : "heart-outline"}
                            size={24}
                            color={isFavorite ? "#FF4444" : "#1a2632"}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Image Carousel */}
                {renderImageCarousel()}

                {/* Color Options */}
                {renderColorOptions()}

                {/* Product Info */}
                <View style={styles.productInfo}>
                    <View style={styles.nameRow}>
                        <Text style={styles.productName}>{product.name}</Text>
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>{product.discount}% OFF</Text>
                        </View>
                    </View>

                    <Text style={styles.productDescription}>{product.description}</Text>

                    {/* Price and Quantity */}
                    <View style={styles.priceQuantityRow}>
                        <View style={styles.priceContainer}>
                            <Text style={styles.currentPrice}>${product.price.toFixed(2)}</Text>
                            <Text style={styles.oldPrice}>${product.oldPrice.toFixed(2)}</Text>
                        </View>

                        <View style={styles.quantitySelector}>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => handleQuantityChange(false)}
                            >
                                <Ionicons name="remove" size={20} color="#1a2632" />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => handleQuantityChange(true)}
                            >
                                <Ionicons name="add" size={20} color="#1a2632" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Dimensions */}
                {renderDimensions()}

                {/* Delivery Section */}
                {renderDeliverySection()}

                {/* Details Section */}
                <View style={styles.detailsSection}>
                    <Text style={styles.sectionTitle}>Details :</Text>
                    <Text style={styles.detailsText}>
                        This product is eligible for returns and size replacements from the 'My Orders' section.
                        {showFullDetails && ' Additional details about the product materials, care instructions, and warranty information can be found here.'}
                        ...{' '}
                        <Text
                            style={styles.readMoreText}
                            onPress={() => setShowFullDetails(!showFullDetails)}
                        >
                            {showFullDetails ? 'Show Less' : 'Read More'}
                        </Text>
                    </Text>
                </View>

                {/* Rating Breakdown */}
                {renderRatingBreakdown()}

                {/* Write Review */}
                <TouchableOpacity style={styles.writeReviewButton}>
                    <Ionicons name="add" size={20} color="#1a2632" />
                    <Text style={styles.writeReviewText}>Write Your Review</Text>
                </TouchableOpacity>

                {/* Similar Products */}
                {renderSimilarProducts()}

                {/* Bottom spacing for Add to Cart button */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Fixed Add to Cart Button */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.addToCartButton}>
                    <View style={styles.cartIconCircle}>
                        <Ionicons name="bag-outline" size={20} color="#FFFFFF" />
                    </View>
                    <Text style={styles.addToCartText}>Add to cart</Text>
                    <Text style={styles.cartPrice}>${totalPrice}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 15,
        backgroundColor: '#FFFFFF',
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F7FA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a2632',
    },
    headerRight: {
        flexDirection: 'row',
        gap: 10,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },

    // Image Carousel
    carouselContainer: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    viewLabelContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    viewLabelText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a2632',
        backgroundColor: '#F5F7FA',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    thumbnailRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 20,
    },
    thumbnailWithLabel: {
        alignItems: 'center',
        gap: 6,
    },
    thumbnailActiveWithLabel: {
        // Active state handled by inner elements
    },
    thumbnailImageBox: {
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: '#F5F7FA',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    thumbnailColumn: {
        width: 50,
        gap: 10,
        alignItems: 'center',
    },
    thumbnailImage: {
        width: 45,
        height: 45,
        borderRadius: 10,
        backgroundColor: '#F5F7FA',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    thumbnailActive: {
        borderWidth: 2,
        borderColor: '#1a2632',
    },
    thumbnail: {
        width: '80%',
        height: '80%',
    },
    thumbnailLabelText: {
        fontSize: 11,
        fontWeight: '500',
        color: '#8B9DB8',
    },
    thumbnailLabelTextActive: {
        color: '#1a2632',
        fontWeight: '700',
    },
    mainImageContainer: {
        height: 220,
        position: 'relative',
    },
    imageSlide: {
        width: SCREEN_WIDTH - 40,
        height: 220,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainImageCircle: {
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: '#F5F7FA',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    mainImage: {
        width: '85%',
        height: '85%',
    },
    navArrow: {
        position: 'absolute',
        top: '50%',
        marginTop: -15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navArrowLeft: {
        left: 0,
    },
    navArrowRight: {
        right: 0,
    },

    // Color Options
    colorSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
        paddingVertical: 15,
    },
    colorOption: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    colorOptionSelected: {
        borderColor: '#1a2632',
        borderWidth: 3,
    },

    // Product Info
    productInfo: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    productName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1a2632',
    },
    discountBadge: {
        backgroundColor: '#FFE8E8',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    discountText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FF4444',
    },
    productDescription: {
        fontSize: 14,
        color: '#8B9DB8',
        lineHeight: 20,
        marginBottom: 15,
    },
    priceQuantityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 10,
    },
    currentPrice: {
        fontSize: 26,
        fontWeight: '700',
        color: '#1a2632',
    },
    oldPrice: {
        fontSize: 16,
        color: '#8B9DB8',
        textDecorationLine: 'line-through',
    },
    quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E9F0',
        borderRadius: 10,
        overflow: 'hidden',
    },
    quantityButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
    },
    quantityText: {
        width: 40,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
        color: '#1a2632',
    },

    // Dimensions
    dimensionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: '#FFFFFF',
    },
    dimensionItem: {
        alignItems: 'center',
        gap: 8,
    },
    dimensionIcon: {
        width: 50,
        height: 50,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E9F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dimensionValue: {
        fontSize: 12,
        color: '#1a2632',
        fontWeight: '500',
    },

    // Delivery Section
    deliverySection: {
        backgroundColor: '#F5F7FA',
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 20,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a2632',
        marginBottom: 5,
    },
    deliverySubtitle: {
        fontSize: 13,
        color: '#8B9DB8',
        marginBottom: 15,
    },
    pincodeContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    pincodeInput: {
        flex: 1,
        height: 48,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 14,
        color: '#1a2632',
    },
    checkButton: {
        height: 48,
        paddingHorizontal: 25,
        backgroundColor: '#1a2632',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    deliveryOptions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    deliveryOption: {
        alignItems: 'center',
        gap: 5,
    },
    deliveryIconCircle: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    deliveryOptionText: {
        fontSize: 11,
        color: '#1a2632',
        textAlign: 'center',
    },

    // Details Section
    detailsSection: {
        paddingHorizontal: 20,
        paddingTop: 25,
        paddingBottom: 15,
    },
    detailsText: {
        fontSize: 14,
        color: '#8B9DB8',
        lineHeight: 22,
    },
    readMoreText: {
        color: '#1a2632',
        fontWeight: '600',
    },

    // Rating Section
    ratingSection: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    ratingLeft: {
        alignItems: 'center',
        marginRight: 30,
    },
    ratingScore: {
        fontSize: 36,
        fontWeight: '700',
        color: '#1a2632',
    },
    starsRow: {
        flexDirection: 'row',
        gap: 2,
        marginVertical: 5,
    },
    ratingCount: {
        fontSize: 14,
        color: '#1a2632',
        fontWeight: '500',
    },
    ratingLabel: {
        fontSize: 12,
        color: '#8B9DB8',
    },
    ratingBreakdown: {
        flex: 1,
        gap: 8,
    },
    ratingBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    ratingStarNum: {
        width: 10,
        fontSize: 12,
        color: '#1a2632',
        fontWeight: '500',
    },
    ratingBarBg: {
        flex: 1,
        height: 6,
        backgroundColor: '#E5E9F0',
        borderRadius: 3,
        overflow: 'hidden',
    },
    ratingBarFill: {
        height: '100%',
        backgroundColor: '#1a2632',
        borderRadius: 3,
    },
    ratingPercent: {
        width: 35,
        fontSize: 12,
        color: '#8B9DB8',
        textAlign: 'right',
    },

    // Write Review
    writeReviewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 15,
        marginHorizontal: 20,
        borderTopWidth: 1,
        borderColor: '#E5E9F0',
    },
    writeReviewText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1a2632',
    },

    // Similar Products
    similarSection: {
        paddingTop: 20,
    },
    similarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    similarTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a2632',
    },
    viewAllText: {
        fontSize: 14,
        color: '#8B9DB8',
    },
    similarCard: {
        width: 160,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
        marginLeft: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    similarImageContainer: {
        width: '100%',
        height: 120,
        backgroundColor: '#F5F7FA',
        borderRadius: 12,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    similarImage: {
        width: '80%',
        height: '80%',
    },
    similarAddButton: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#1a2632',
        justifyContent: 'center',
        alignItems: 'center',
    },
    similarName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1a2632',
        marginBottom: 3,
    },
    similarDesc: {
        fontSize: 12,
        color: '#8B9DB8',
        marginBottom: 8,
    },
    similarPriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    similarPrices: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    similarPrice: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1a2632',
    },
    similarOldPrice: {
        fontSize: 12,
        color: '#8B9DB8',
        textDecorationLine: 'line-through',
    },
    similarRating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    similarRatingText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#1a2632',
    },

    // Bottom Bar
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingVertical: 15,
        paddingBottom: Platform.OS === 'ios' ? 30 : 15,
        backgroundColor: '#FFFFFF',
    },
    addToCartButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a2632',
        borderRadius: 16,
        paddingVertical: 16,
        gap: 12,
    },
    cartIconCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addToCartText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    cartPrice: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        marginLeft: 20,
    },
});
