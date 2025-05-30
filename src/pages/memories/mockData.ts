import type { MemoryDto } from "@/types/memory";

import { ReactionType } from "@/types/memory";

export const mockMemories: MemoryDto[] = [
  {
    id: "1",
    title: "Beach Day with Family",
    description:
      "Amazing day at the beach with the family! The weather was perfect and the kids had so much fun building sandcastles. Can't wait to come back here next summer.",
    createdAt: "2024-01-15T14:30:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
    authorId: "person1",
    authorName: "Sarah Johnson",
    authorAvatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612c7c8?w=100&h=100&fit=crop&crop=face",
    isPublic: true,
    images: [
      {
        id: "img1",
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
        caption: "Family fun at Santa Monica Beach",
        order: 0,
        location: {
          id: "loc1",
          name: "Santa Monica Beach",
          address: "Santa Monica, CA",
          coordinates: {
            latitude: 34.0195,
            longitude: -118.4912,
          },
          city: "Santa Monica",
          country: "USA",
        },
        people: [
          {
            id: "person1",
            name: "Sarah Johnson",
            avatarUrl:
              "https://images.unsplash.com/photo-1494790108755-2616b612c7c8?w=100&h=100&fit=crop&crop=face",
            isTagged: true,
          },
          {
            id: "person2",
            name: "Emma Johnson",
            avatarUrl:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
            isTagged: true,
          },
          {
            id: "person3",
            name: "Liam Johnson",
            avatarUrl:
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
            isTagged: true,
          },
        ],
      },
      {
        id: "img2",
        url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
        caption: "The kids building an epic sandcastle",
        order: 1,
        people: [
          {
            id: "person2",
            name: "Emma Johnson",
            avatarUrl:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
            isTagged: true,
          },
          {
            id: "person3",
            name: "Liam Johnson",
            avatarUrl:
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
            isTagged: true,
          },
        ],
      },
      {
        id: "img3",
        url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
        caption: "Sunset views were incredible",
        order: 2,
        people: [
          {
            id: "person1",
            name: "Sarah Johnson",
            avatarUrl:
              "https://images.unsplash.com/photo-1494790108755-2616b612c7c8?w=100&h=100&fit=crop&crop=face",
            isTagged: true,
          },
        ],
      },
    ],
    people: [
      {
        id: "person1",
        name: "Sarah Johnson",
        avatarUrl:
          "https://images.unsplash.com/photo-1494790108755-2616b612c7c8?w=100&h=100&fit=crop&crop=face",
        isTagged: true,
      },
      {
        id: "person2",
        name: "Emma Johnson",
        avatarUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        isTagged: true,
      },
      {
        id: "person3",
        name: "Liam Johnson",
        avatarUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
        isTagged: true,
      },
    ],
    locations: [
      {
        id: "loc1",
        name: "Santa Monica Beach",
        address: "Santa Monica, CA",
        coordinates: {
          latitude: 34.0195,
          longitude: -118.4912,
        },
        city: "Santa Monica",
        country: "USA",
      },
    ],
    comments: [
      {
        id: "comment1",
        content: "What a beautiful day! The kids look so happy 😊",
        createdAt: "2024-01-15T15:00:00Z",
        authorId: "person4",
        authorName: "Mike Davis",
        authorAvatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      },
      {
        id: "comment2",
        content:
          "Love these family memories! Santa Monica is our favorite spot too.",
        createdAt: "2024-01-15T16:30:00Z",
        authorId: "person5",
        authorName: "Lisa Chen",
        authorAvatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      },
    ],
    reactions: [
      {
        id: "reaction1",
        type: ReactionType.LOVE,
        userId: "person4",
        userName: "Mike Davis",
        createdAt: "2024-01-15T15:00:00Z",
      },
      {
        id: "reaction2",
        type: ReactionType.LIKE,
        userId: "person5",
        userName: "Lisa Chen",
        createdAt: "2024-01-15T16:00:00Z",
      },
      {
        id: "reaction3",
        type: ReactionType.LIKE,
        userId: "person6",
        userName: "David Wilson",
        createdAt: "2024-01-15T17:00:00Z",
      },
    ],
  },
  {
    id: "2",
    title: "Yosemite Hiking Adventure",
    description:
      "Incredible hiking adventure in Yosemite! The views from Half Dome were absolutely breathtaking. Challenging hike but so worth it.",
    createdAt: "2024-01-10T08:45:00Z",
    updatedAt: "2024-01-10T08:45:00Z",
    authorId: "person1",
    authorName: "Sarah Johnson",
    authorAvatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612c7c8?w=100&h=100&fit=crop&crop=face",
    isPublic: true,
    images: [
      {
        id: "img4",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        caption: "Half Dome in all its glory",
        order: 0,
        location: {
          id: "loc2",
          name: "Half Dome, Yosemite",
          address: "Yosemite National Park, CA",
          coordinates: {
            latitude: 37.7459,
            longitude: -119.5332,
          },
          city: "Yosemite Valley",
          country: "USA",
        },
        people: [
          {
            id: "person1",
            name: "Sarah Johnson",
            avatarUrl:
              "https://images.unsplash.com/photo-1494790108755-2616b612c7c8?w=100&h=100&fit=crop&crop=face",
            isTagged: true,
          },
          {
            id: "person7",
            name: "Alex Rodriguez",
            avatarUrl:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
            isTagged: true,
          },
        ],
      },
      {
        id: "img5",
        url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
        caption: "The trail leading up to the summit",
        order: 1,
        people: [
          {
            id: "person7",
            name: "Alex Rodriguez",
            avatarUrl:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
            isTagged: true,
          },
        ],
      },
      {
        id: "img6",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        caption: "Victory photo at the top!",
        order: 2,
        people: [
          {
            id: "person1",
            name: "Sarah Johnson",
            avatarUrl:
              "https://images.unsplash.com/photo-1494790108755-2616b612c7c8?w=100&h=100&fit=crop&crop=face",
            isTagged: true,
          },
          {
            id: "person7",
            name: "Alex Rodriguez",
            avatarUrl:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
            isTagged: true,
          },
        ],
      },
    ],
    people: [
      {
        id: "person1",
        name: "Sarah Johnson",
        avatarUrl:
          "https://images.unsplash.com/photo-1494790108755-2616b612c7c8?w=100&h=100&fit=crop&crop=face",
        isTagged: true,
      },
      {
        id: "person7",
        name: "Alex Rodriguez",
        avatarUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        isTagged: true,
      },
    ],
    locations: [
      {
        id: "loc2",
        name: "Half Dome, Yosemite",
        address: "Yosemite National Park, CA",
        coordinates: {
          latitude: 37.7459,
          longitude: -119.5332,
        },
        city: "Yosemite Valley",
        country: "USA",
      },
    ],
    comments: [
      {
        id: "comment3",
        content: "Wow! That's an amazing accomplishment. Half Dome is no joke!",
        createdAt: "2024-01-10T10:00:00Z",
        authorId: "person4",
        authorName: "Mike Davis",
        authorAvatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      },
    ],
    reactions: [
      {
        id: "reaction4",
        type: ReactionType.WOW,
        userId: "person4",
        userName: "Mike Davis",
        createdAt: "2024-01-10T10:00:00Z",
      },
      {
        id: "reaction5",
        type: ReactionType.LIKE,
        userId: "person5",
        userName: "Lisa Chen",
        createdAt: "2024-01-10T11:00:00Z",
      },
    ],
  },
  {
    id: "3",
    title: "Birthday Celebration",
    description:
      "Birthday celebration at our favorite restaurant! Such a wonderful evening with friends and family. The cake was delicious!",
    createdAt: "2024-01-05T19:20:00Z",
    updatedAt: "2024-01-05T19:20:00Z",
    authorId: "person1",
    authorName: "Sarah Johnson",
    authorAvatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612c7c8?w=100&h=100&fit=crop&crop=face",
    isPublic: true,
    images: [
      {
        id: "img7",
        url: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop",
        caption: "Birthday dinner setup",
        order: 0,
        location: {
          id: "loc3",
          name: "The Ivy Restaurant",
          address: "113 N Robertson Blvd, West Hollywood, CA",
          coordinates: {
            latitude: 34.0836,
            longitude: -118.3755,
          },
          city: "West Hollywood",
          country: "USA",
        },
        people: [
          {
            id: "person1",
            name: "Sarah Johnson",
            avatarUrl:
              "https://images.unsplash.com/photo-1494790108755-2616b612c7c8?w=100&h=100&fit=crop&crop=face",
            isTagged: true,
          },
          {
            id: "person2",
            name: "Emma Johnson",
            avatarUrl:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
            isTagged: true,
          },
          {
            id: "person3",
            name: "Liam Johnson",
            avatarUrl:
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
            isTagged: true,
          },
          {
            id: "person4",
            name: "Mike Davis",
            avatarUrl:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
            isTagged: true,
          },
          {
            id: "person5",
            name: "Lisa Chen",
            avatarUrl:
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
            isTagged: true,
          },
        ],
      },
      {
        id: "img8",
        url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
        caption: "The birthday cake was incredible!",
        order: 1,
        people: [
          {
            id: "person1",
            name: "Sarah Johnson",
            avatarUrl:
              "https://images.unsplash.com/photo-1494790108755-2616b612c7c8?w=100&h=100&fit=crop&crop=face",
            isTagged: true,
          },
        ],
      },
      {
        id: "img9",
        url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=600&fit=crop",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop",
        caption: "Group photo before dinner",
        order: 2,
        people: [
          {
            id: "person1",
            name: "Sarah Johnson",
            avatarUrl:
              "https://images.unsplash.com/photo-1494790108755-2616b612c7c8?w=100&h=100&fit=crop&crop=face",
            isTagged: true,
          },
          {
            id: "person2",
            name: "Emma Johnson",
            avatarUrl:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
            isTagged: true,
          },
          {
            id: "person3",
            name: "Liam Johnson",
            avatarUrl:
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
            isTagged: true,
          },
          {
            id: "person4",
            name: "Mike Davis",
            avatarUrl:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
            isTagged: true,
          },
          {
            id: "person5",
            name: "Lisa Chen",
            avatarUrl:
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
            isTagged: true,
          },
          {
            id: "person6",
            name: "David Wilson",
            avatarUrl:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
            isTagged: true,
          },
        ],
      },
      {
        id: "img10",
        url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
        caption: "Delicious appetizers to start the night",
        order: 3,
        people: [],
      },
      {
        id: "img11",
        url: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop",
        caption: "Making a wish!",
        order: 4,
        people: [
          {
            id: "person1",
            name: "Sarah Johnson",
            avatarUrl:
              "https://images.unsplash.com/photo-1494790108755-2616b612c7c8?w=100&h=100&fit=crop&crop=face",
            isTagged: true,
          },
        ],
      },
    ],
    people: [
      {
        id: "person1",
        name: "Sarah Johnson",
        avatarUrl:
          "https://images.unsplash.com/photo-1494790108755-2616b612c7c8?w=100&h=100&fit=crop&crop=face",
        isTagged: true,
      },
      {
        id: "person2",
        name: "Emma Johnson",
        avatarUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        isTagged: true,
      },
      {
        id: "person3",
        name: "Liam Johnson",
        avatarUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
        isTagged: true,
      },
      {
        id: "person4",
        name: "Mike Davis",
        avatarUrl:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        isTagged: true,
      },
      {
        id: "person5",
        name: "Lisa Chen",
        avatarUrl:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        isTagged: true,
      },
      {
        id: "person6",
        name: "David Wilson",
        avatarUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        isTagged: true,
      },
    ],
    locations: [
      {
        id: "loc3",
        name: "The Ivy Restaurant",
        address: "113 N Robertson Blvd, West Hollywood, CA",
        coordinates: {
          latitude: 34.0836,
          longitude: -118.3755,
        },
        city: "West Hollywood",
        country: "USA",
      },
    ],
    comments: [
      {
        id: "comment4",
        content: "Happy birthday! What a lovely celebration 🎉",
        createdAt: "2024-01-05T20:00:00Z",
        authorId: "person7",
        authorName: "Alex Rodriguez",
        authorAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      },
      {
        id: "comment5",
        content: "The cake looks amazing! Hope you had a wonderful time.",
        createdAt: "2024-01-05T21:15:00Z",
        authorId: "person8",
        authorName: "Jennifer Taylor",
        authorAvatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      },
    ],
    reactions: [
      {
        id: "reaction6",
        type: ReactionType.LOVE,
        userId: "person7",
        userName: "Alex Rodriguez",
        createdAt: "2024-01-05T20:00:00Z",
      },
      {
        id: "reaction7",
        type: ReactionType.LIKE,
        userId: "person8",
        userName: "Jennifer Taylor",
        createdAt: "2024-01-05T21:00:00Z",
      },
      {
        id: "reaction8",
        type: ReactionType.LIKE,
        userId: "person9",
        userName: "Robert Brown",
        createdAt: "2024-01-05T22:00:00Z",
      },
    ],
  },
];
