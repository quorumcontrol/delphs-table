import {
  VStack,
  Text,
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  FormHelperText,
  Button,
  Link,
  Spinner,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Layout from "../src/components/Layout";
import { useForm } from "react-hook-form";
import { useState } from "react";
import useNewUser, { UserData } from "../src/hooks/useUser";
import debug from "debug";
import { useRouter } from "next/router";
import { useUserBadges } from "../src/hooks/BadgeOfAssembly";
import NextLink from "next/link";

const log = debug("NewUserPage");

type FormData = UserData;

const NewUser: NextPage = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const createUser = useNewUser();
  const router = useRouter();
  const { data: userBadges, isLoading } = useUserBadges();

  const hasBadges = userBadges && userBadges.length > 0;

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      log("creating new user");
      await createUser.mutateAsync({ ...data, trustDevice: true });
      router.push("/play");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Layout>
        <VStack spacing={10}>
          <Text>Looks like you're new here. Let's get you setup.</Text>
          {!hasBadges && !isLoading && (
            <Text>
              You need to have a
              <NextLink passHref href="https://boa.larvamaiorum.com/claim">
                <Link>a Badge of Assembly</Link>
              </NextLink>
              to play. It looks like you don't have any of these.
            </Text>
          )}
          <Box>
            {loading && <Spinner />}
            {!loading && (
              <form onSubmit={handleSubmit(onSubmit)}>
                <VStack spacing={10}>
                  <FormControl isRequired isInvalid={!!errors.username}>
                    <FormLabel htmlFor="username">
                      What do you want to be called?
                    </FormLabel>
                    <Input
                      id="username"
                      type="text"
                      {...register("username", { required: true })}
                    />
                    <FormHelperText>You can change this later.</FormHelperText>
                    <FormErrorMessage>Username is required.</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.email}>
                    <FormLabel htmlFor="email">Email (optional)</FormLabel>
                    <Input
                      id="email"
                      type="email"
                      {...register("email", { required: false })}
                    />
                    <FormHelperText>
                      We will never share your email. We'll only use this to let you know
                      about game updates.
                    </FormHelperText>
                    <FormErrorMessage>Invalid email</FormErrorMessage>
                  </FormControl>

                  {/* <FormControl isInvalid={!!errors.trustDevice}>
                    <Checkbox
                      defaultChecked
                      id="trustDevice"
                      {...register("trustDevice")}
                    >
                      Trust this device?
                    </Checkbox>
                    <FormHelperText>
                      Allow this device to send game transactions on your behalf without
                      signing. It will have no access to your funds.
                    </FormHelperText>
                  </FormControl> */}

                  {!isLoading && (
                    <FormControl>
                      <Button isDisabled={!hasBadges} type="submit">
                        Save
                      </Button>
                    </FormControl>
                  )}
                </VStack>
              </form>
            )}
          </Box>
        </VStack>
      </Layout>
    </>
  );
};

export default NewUser;
