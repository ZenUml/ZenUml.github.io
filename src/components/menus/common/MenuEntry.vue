<template>
  <!--<a class="menu-entry button flex flex&#45;&#45;row flex&#45;&#45;align-center">-->
  <div class="menu-entry flex flex--row flex--align-center" href="javascript:void(0)">
    <!--<div class="menu-entry__icon flex flex&#45;&#45;column flex&#45;&#45;center">-->
      <!--<slot name="icon"></slot>-->
    <!--</div>-->
    <div class="menu-entry__text flex flex--column">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss">
@import '../../common/variables.scss';

.menu-entry {
  text-align: left;
  padding: 10px;
  height: auto;
  font-size: 17px;
  line-height: 1.5;
  text-transform: none;
  white-space: normal;

  div div {
    /* text-decoration: underline; */
    text-decoration-skip: ink;

    .menu-entry__label {
      text-decoration: none;
    }
  }

  > div {
    width: 100%;
  }

  span {
    display: inline-block;
    font-size: 0.75rem;
    opacity: 0.5;

    span {
      display: inline;
      opacity: 1;
    }
  }
}

.menu-info-entries {
  padding: 10px;
  margin: -10px -10px 10px;
  background-color: rgba(255, 255, 255, 0.2);
}

.menu-entry--info {
  padding-top: 3px;
  padding-bottom: 3px;
}

.menu-entry__icon {
  height: 20px;
  width: 20px;
  margin-right: 12px;
  flex: none;
}

.menu-entry__icon--disabled {
  opacity: 0.5;
}

.menu-entry__icon--image {
  border-radius: $border-radius-base;
  overflow: hidden;
}

.hidden-file {
  position: fixed;
  top: -999px;
}

.menu-entry__label {
  float: right;
  font-size: 0.6rem;
  font-weight: 600;
  padding: 0.05em 0.25em;
  background-color: darken($error-color, 10);
  border-radius: 3px;
  color: #fff;
}

.menu-entry__text {
  width: 100%;
  overflow: hidden;
}
</style>
