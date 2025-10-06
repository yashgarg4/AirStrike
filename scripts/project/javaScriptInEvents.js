var firstAdDelay = false;

var adSpotInterstitial = "en0fcbxu";
var isAdReady = false;
var adSpotRewardedVideo = "vzprx2fn";
var isRVReady = false;
var isRewardUser = false;
var packageName = "com.heftybrains.airstrikeJGSTB";

function postScore(score) {
  if (!score) {
    console.log("Jiogames: postScore() no value ", score);
  }
  if (window.DroidHandler) {
    console.log("Jiogames: postScore() " + score);
    window.DroidHandler.postScore(score);
  }
}

function cacheAdMidRoll(adKeyId, source) {
  console.log(
    "Jiogames: cacheAdMidRoll() adkeyId: " +
      adKeyId +
      " source: " +
      source +
      " DroidHandler " +
      window.DroidHandler
  );
  if (!adKeyId || !source) {
    adKeyId
      ? null
      : console.log(
          "Jiogames: cacheAdMidRoll() no adKeyId to cacheAd ",
          adKeyId
        );
    source
      ? null
      : console.log("Jiogames: cacheAdMidRoll() no source to cacheAd ", source);
    return;
  }
  // window.onAdPrepared(adKeyId);
  if (window.DroidHandler && !isAdReady) {
    window.DroidHandler.cacheAd(adKeyId, source);
  }
}

function cacheRewardedVideo(adKeyId, source) {
  console.log(
    "Jiogames: cacheRewardedVideo() for ",
    adKeyId + " source: " + source + " DroidHandler " + window.DroidHandler
  );
  if (!adKeyId || !source) {
    adKeyId
      ? null
      : console.log(
          "Jiogames: cacheRewardedVideo() no adKeyId to cacheAd ",
          adKeyId
        );
    source
      ? null
      : console.log(
          "Jiogames: cacheRewardedVideo() no source to cacheAd ",
          source
        );
    return;
  }
  // window.onAdPrepared(adKeyId);
  if (window.DroidHandler && !isRVReady) {
    window.DroidHandler.cacheAdRewardedVideo(adKeyId, source);
  }
}

function showAdMidRoll(adKeyId, source) {
  console.log(
    "Jiogames: showAdMidRoll() adKeyId: " +
      adKeyId +
      " source " +
      source +
      " firstAdDelay " +
      firstAdDelay +
      " DroidHandler " +
      window.DroidHandler
  );
  if (!adKeyId || !source) {
    adKeyId
      ? null
      : console.log(
          "Jiogames: showAdMidRoll() no adKeyId to cacheAd ",
          adKeyId
        );
    source
      ? null
      : console.log("Jiogames: showAdMidRoll() no source to cacheAd ", source);
    return;
  }
  // window.onAdClosed(adKeyId, false, false);
  if (window.DroidHandler && firstAdDelay && isAdReady) {
    window.DroidHandler.showAd(adKeyId, source);
  }
}

function showRewardedVideo(adKeyId, source) {
  console.log(
    "Jiogames: showRewardedVideo() adKeyId: " +
      adKeyId +
      " source " +
      source +
      " DroidHandler " +
      window.DroidHandler
  );
  if (!adKeyId || !source) {
    adKeyId
      ? null
      : console.log(
          "Jiogames: showRewardedVideo() no adKeyId to cacheAd ",
          adKeyId
        );
    source
      ? null
      : console.log(
          "Jiogames: showRewardedVideo() no source to cacheAd ",
          source
        );
    return;
  }
  // window.onAdClosed(adKeyId, true, true);
  if (window.DroidHandler && isRVReady) {
    isRewardUser = false;
    window.DroidHandler.ShowRewardedVideo(adKeyId, source);
  }
}

document.addEventListener("visibilitychange", onVisibilityChanged, false);
function onVisibilityChanged() {
  if (
    document.hidden ||
    document.mozHidden ||
    document.webkitHidden ||
    document.msHidden
  ) {
    //Pause Game
    console.log("Jiogames: Pause Game");
  } else {
    //Resume Game
    console.log("Jiogames: Resume Game");
  }
}

function getUserProfile() {
  if (window.DroidHandler) {
    window.DroidHandler.getUserProfile();
  }
}

window.onUserProfileResponse = function (message) {
  console.log("onUserProfileResponse" + [JSON.stringify(message)]);
};

window.onAdPrepared = function (adSpotKey) {
  console.log("JioGames: onAdPrepared " + adSpotKey.toString());
  adSpotKey == adSpotInterstitial &&
    ((isAdReady = true),
    console.log("JioGames: onAdPrepared MidRoll " + isAdReady));
  adSpotKey == adSpotRewardedVideo &&
    ((isRVReady = true),
    console.log("JioGames: onAdPrepared RewardedVideo " + isRVReady));
  if (adSpotKey == adSpotRewardedVideo) {
    c3_callFunction("rvReady");
  }
};
window.onAdClosed = function (
  adSpotKey,
  pIsVideoCompleted,
  pIsEligibleForReward
) {
  adSpotKey == adSpotInterstitial &&
    ((isAdReady = false),
    console.log("JioGames: onAdClose MidRoll " + isAdReady));
  adSpotKey == adSpotRewardedVideo &&
    ((isRVReady = false),
    console.log("JioGames: onAdClose RewardedVideo " + isRVReady));

  if (adSpotKey == adSpotRewardedVideo && pIsVideoCompleted) {
    isRewardUser = pIsEligibleForReward;
    GratifyReward();
    c3_callFunction("rvNotReady");
    //Gratify User
  }
  console.log(
    "JioGames: onAdClosed " + adSpotKey.toString(),
    " pIsVideoCompleted " +
      pIsVideoCompleted +
      " pIsEligibleForReward " +
      pIsEligibleForReward
  );
};
window.onAdFailedToLoad = function (adSpotKey, pDescription) {
  adSpotKey == adSpotInterstitial &&
    ((isAdReady = false),
    console.log(
      "JioGames: onAdFailedToLoad MidRoll " +
        isAdReady +
        " description " +
        pDescription
    ));
  adSpotKey == adSpotRewardedVideo &&
    ((isRVReady = false),
    console.log(
      "JioGames: onAdFailedToLoad RewardedVideo " +
        isRVReady +
        " description " +
        pDescription
    ));
  console.log(
    "JioGames: onAdFailedToLoad " + adSpotKey + " pDescription " + pDescription
  );

  if (adSpotKey == adSpotRewardedVideo) {
    c3_callFunction("rvNotReady");
  }
};

window.onAdClick = function (adSpotKey) {};
window.onAdMediaCollapse = function (adSpotKey) {};
window.onAdMediaExpand = function (adSpotKey) {};
window.onAdMediaStart = function (adSpotKey) {};
window.onAdRefresh = function (adSpotKey) {};
window.onAdRender = function (adSpotKey) {};
window.onAdSkippable = function (adSpotKey) {};
window.onAdView = function (adSpotKey) {};

function GratifyReward() {
  console.log("GratifyReward Game user here");
  c3_callFunction("gratify1");
}

function gratifyUser() {
  return isRewardUser;
}

function cacheAd() {
  if (!isAdReady) {
    cacheAdMidRoll(adSpotInterstitial, packageName);
  }
  // window.onAdPrepared(adSpotInterstitial);//cheat
}
function cacheRewardedAd() {
  if (!isRVReady) {
    cacheRewardedVideo(adSpotRewardedVideo, packageName);
  }
  // window.onAdPrepared(adSpotRewardedVideo);//cheat
}
function showAd() {
  if (isAdReady) {
    showAdMidRoll(adSpotInterstitial, packageName);
  }
  // window.onAdClosed(adSpotInterstitial, true, true);
}
function showRewardedAd() {
  if (isRVReady) {
    showRewardedVideo(adSpotRewardedVideo, packageName);
  }
  // window.onAdClosed(adSpotRewardedVideo, true, true);
}

function gameCacheAd() {
  cacheAd();
  setTimeout(function () {
    console.log("This message appears after 5 seconds.");
    cacheRewardedAd();
  }, 5000); // 5000 milliseconds = 5 seconds
}

if (!firstAdDelay) {
  setTimeout(function () {
    firstAdDelay = true;
  }, 20000);
}

const scriptsInEvents = {
  async Esfinalgame_Event2_Act1(runtime, localVars) {
    postScore(runtime.globalVars.Score);
  },

  async Esfinalgame_Event2_Act2(runtime, localVars) {
    showAd();
  },

  async Esgame_Event150_Act10(runtime, localVars) {
    console.log("ValueChance--");
  },

  async Esgame_Event154_Act2(runtime, localVars) {
    postScore(runtime.globalVars.gameScore);
    showAd();
  },

  async Esgame_Event156_Act2(runtime, localVars) {
    console.log("ADDTRUE");
  },

  async Esgame_Event157_Act2(runtime, localVars) {
    console.log("ADDTRUE");
  },

  async Esgame_Event158_Act2(runtime, localVars) {
    console.log("valueChance set 1 =====");
  },

  async Esgame_Event158_Act37(runtime, localVars) {
    console.log("valueChance set 1 ++++");
  },

  async Esgame_Event159_Act1(runtime, localVars) {},

  async Esgame_Event209_Act7(runtime, localVars) {
    postScore(runtime.globalVars.gameScore);
    showAd();
  },

  async Esgame_Event210_Act1(runtime, localVars) {
    gameCacheAd();
  },

  async Esgame_Event212_Act1(runtime, localVars) {
    showRewardedAd();
  },

  async Esgame_Event213_Act8(runtime, localVars) {
    postScore(runtime.globalVars.gameScore);
    showAd();
  },

  async Esgame_Event216_Act1(runtime, localVars) {
    showRewardedAd();
  },

  async Esgame_Event217_Act8(runtime, localVars) {
    postScore(runtime.globalVars.gameScore);
    showAd();
  },

  async Esgame_Event2_Act41(runtime, localVars) {
    runtime.globalVars.rv_ad_enabled = isRVReady;
  },
};

globalThis.C3.JavaScriptInEvents = scriptsInEvents;

