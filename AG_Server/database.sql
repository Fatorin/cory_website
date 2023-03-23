CREATE TABLE "LoginHistory" (
    "Id" uuid NOT NULL,
    "UserId" text NOT NULL,
    "CreateDate" timestamp without time zone NOT NULL,
    "DeviceId" text NULL,
    "SessionId" text NULL,
    "Ip" text NULL,
    "AppVersion" text NULL
);
CREATE TABLE "Currency" (
    "UserId" text NOT NULL,
    "CurrencyType" integer NOT NULL,
    "Amount" bigint NOT NULL,
    PRIMARY KEY ("UserId", "CurrencyType")
);
CREATE TABLE "PushToken" (
    "UserId" text NOT NULL,
    "Token" text NOT NULL,
    "Status" int4 NOT NULL,
    "CreateDate" timestamp without time zone NOT NULL,
    PRIMARY KEY ("Token")
);
CREATE TABLE "CurrencyLog" (
    "Id" uuid NOT NULL,
    "UserId" text NOT NULL,
    "CurrencyType" integer NOT NULL,
    "Amount" bigint NOT NULL,
    "CreateDate" timestamp without time zone NOT NULL,
    "Issue" text NULL,
    PRIMARY KEY ("Id")
);
CREATE TABLE "User" (
    "Id" text NOT NULL,
    "Name" text NULL,
    "Tag" text NULL,
    "Email" text NULL,
    "PhotoUrl" text NULL,
    "WalletAddress" text NULL,
    "Status" int4 NOT NULL default 0,
    "TutorialEnumProgress" integer NULL,
    "TutorialFinishIds" jsonb NULL,
    PRIMARY KEY ("Id")
);
CREATE TABLE "Achievement" (
    "AchievementId" text NOT NULL,
    "UserId" text NOT NULL,
    "Value" bigint NOT NULL,
    "AchievementType" integer NOT NULL,
    "LastRewardDate" timestamp without time zone NOT NULL,
    "RefreshDay" integer NOT NULL,
    "ProgressType" integer NOT NULL,
    "Status" smallInt NOT NULL,
    PRIMARY KEY ("AchievementId", "UserId")
);
CREATE TABLE "Lordroad" (
    "LordroadId" int NOT NULL,
    "UserId" text NOT NULL,
    "RewardHistory" BOOLEAN ARRAY NOT NULL,
    PRIMARY KEY ("LordroadId", "UserId")
);
CREATE TABLE "SeasonEvent" (
    "Id" int NOT NULL,
    "UserId" text NOT NULL,
    "RewardHistory" BOOLEAN ARRAY NOT NULL,
    PRIMARY KEY ("Id", "UserId")
);
CREATE TABLE "LimitedTimeEvent" (
    "Id" int NOT NULL,
    "UserId" text NOT NULL,
    "RewardHistory" BOOLEAN ARRAY NOT NULL,
    PRIMARY KEY ("Id", "UserId")
);
CREATE TABLE "MapInfo" (
    "Guid" uuid NOT NULL,
	"Title" text NOT NULL,
    "UserId" text NOT NULL,
    "Official" BOOLEAN NOT NULL,
    "Disabled" BOOLEAN NOT NULL,
    "LevelData" text NOT NULL,
	"Version" int NOT NULL,
    "CreateDate" timestamp without time zone NOT NULL,
    "LastUpdatedDate" timestamp without time zone NOT NULL,
    PRIMARY KEY ("Guid")
);
CREATE TABLE "ItemInfo" (
    "UserId" text NOT NULL,
    "Guid" uuid NOT NULL,
    "Level" int NOT NULL,
    "ReferenceID" text NOT NULL,
    "NFTLinks" text,
    PRIMARY KEY ("UserId","Guid")
);
CREATE TABLE "ItemLog" (
    "Id" uuid NOT NULL,
    "UserId" text NOT NULL,
    "Guid" uuid NOT NULL,
    "CreateDate" timestamp without time zone NOT NULL,
    "Value" int NOT NULL,
    "Issue" text NULL,
    PRIMARY KEY ("Id")
);
CREATE TABLE "Equip" (
    "UserId" text NOT NULL,
    "CubsRefID" text NOT NULL,
	"CurrentUsed" BOOLEAN NOT NULL,
	"Items" uuid array,
    PRIMARY KEY ("UserId","CubsRefID")
);