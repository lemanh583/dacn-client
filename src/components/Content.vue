<template>
  <div>
    <div class="row block-content">
      <div class="col-4">
        <router-link to="/"> 
        <img
          class="image-content"
          src="https://maytinhvui.com/wp-content/uploads/2020/11/hinh-nen-may-tinh-4k-game-min.jpg"
          alt=""
        />
        </router-link>
      </div>
      <div class="col-8 ">
        <div class="content">
          <router-link to="/"> 
            <h3 class="title">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quia,
              corporis illo blanditiis nostrum itaque tenetur deleniti quidem
              
            </h3>
          </router-link>
          <p class="descriptions">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odit
            magnam ea molesti sdvsdvsdvsdv m ea molesti sdvsdvsdvsdv m ea molesti sdvsdvsdvsdv
            sdvdsvdsvsdvsdvsdvsdvknjgf m ea molesti sdvsdvsdvsdv
          </p>
        </div>
      </div> 
    </div>
    <div class="row">
      <div class="col-12">
        <div class="line"></div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.block-content {
  padding: 20px 0;
  width: 100%;
  height: 150px;
  /* border-bottom: 1px solid black; */
  box-sizing: border-box;
  text-overflow: ellipsis;
}
.image-content {
  max-width: 100%;
  max-height: 120px;
}
.title {
  font-size: 16px;
  line-height: 22px;
  font-weight: 700;
}
.descriptions {
  text-overflow: ellipsis;
}
.content {
  text-overflow: ellipsis;
  display: block;
  overflow: hidden;
}
p {
  font-size: 13px;
}
a {
  text-decoration: none;
  color: black;
}
a:hover {
  color: blue;
}
</style>
